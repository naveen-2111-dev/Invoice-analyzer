import { GetCollection } from "@/lib/mongodb/link";
import { Invoice, Questionnaire, record, uploadDocType } from "@/types/api";
import { compareSample } from "@/utils/_helper";
import { CurrencyAnomaly } from "@/utils/rules/currencyanomaly";
import { DateAnomaly } from "@/utils/rules/dateanomaly";
import { LineMathAnomaly } from "@/utils/rules/linemathanomaly";
import { NullAnomaly } from "@/utils/rules/nullanomaly";
import { TotalBalance } from "@/utils/rules/totalbalance";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params;
    const { questionnaire }: { questionnaire: Questionnaire } = await request.json();

    //question is a json object
    if (!questionnaire || typeof questionnaire !== "object") {
        return NextResponse.json({ error: "Invalid questionnaire data" }, { status: 400 });
    }

    const collection = await GetCollection<uploadDocType>("uploads");
    const doc = await collection.findOne({ uploadId: slug });

    if (!doc) {
        return NextResponse.json({ error: "Upload ID not found" }, { status: 404 });
    }

    //run all rules
    const total = await TotalBalance(doc.data ?? []);
    const date = await DateAnomaly(doc.data ?? []);
    const currency = await CurrencyAnomaly(doc.data ?? []);
    const nullAnomaly = await NullAnomaly(doc.data ?? []);
    const lineMath = await LineMathAnomaly(doc.data ?? []);

    const FinalAnalize = {
        total: total,
        date: date,
        currency: currency,
        nullAnomaly: nullAnomaly,
        lineMath: lineMath
    };

    //score calculation
    const invoiceStatus: Record<number, boolean> = {};
    const ruleFinding = [
        { rule: "TOTALS_BALANCE", ok: total.allOk },
        { rule: "LINE_MATH", ok: lineMath.allOk },
        { rule: "DATE_ISO", ok: date.allOk },
        { rule: "CURRENCY_ALLOWED", ok: currency.allOk },
        { rule: "TRN_PRESEN", ok: nullAnomaly.allOk },
    ];

    Object.values(FinalAnalize).forEach((rule: any) => {
        rule.results.forEach((r: { index: number; ok: boolean }) => {
            const i = r.index;
            if (invoiceStatus[i] === undefined) {
                invoiceStatus[i] = r.ok;
            } else {
                invoiceStatus[i] = invoiceStatus[i] && r.ok;
            }
        });
    });

    const rowsSuccessfullyParsed = Object.values(invoiceStatus).filter(Boolean).length;
    const ruleSuccessfullyPassed = ruleFinding.filter(r => r.ok).length;
    const postureScore = () => {
        let score = 0;
        if (questionnaire.webhooks) score += 20; //webhook 40% weightage
        if (questionnaire.sandbox_env) score += 10; //sandbox 20% weightage
        if (questionnaire.retries) score += 20; //retries 40% weightage
        return score * 2;
    }

    const dataScore: number = (rowsSuccessfullyParsed / (doc.recordCount || 1)) * 100;
    const rulesScore: number = (ruleSuccessfullyPassed / ruleFinding.length) * 100;
    const coverage = compareSample(doc.data as record[]);

    /**
     * @description Overall Score Calculation
     * Data 25% weightage
     * Coverage 35% weightage
     * Rules 30% weightage
     * Posture 10% weightage
     */
    const overall: number = (dataScore * 0.25) + (coverage.coverageScore * 0.35) + (rulesScore * 0.30) + (postureScore() * 0.10);

    const Score = {
        dataScore: dataScore.toFixed(2) + "%",
        rulesScore: rulesScore.toFixed(2) + "%",
        postureScore: postureScore().toFixed(2) + "%",
        coverage: coverage.coverageScore.toFixed(2) + "%",
        overall: overall.toFixed(2) + "%",
    }

    const persist = {
        reportId: slug + randomUUID(),
        finding: ruleFinding,
        analyze: FinalAnalize,
        Score: Score
    }

    const reportCollection = await GetCollection("reports");
    const res = await reportCollection.insertOne(persist);

    if (res.insertedId)
        return NextResponse.json({ message: "Analysis complete", ruleFinding: ruleFinding, Score: Score, finalAnalyze: FinalAnalize }, {
            status: 200,
        });
    else
        return NextResponse.json({ error: "Failed to persist analysis report" }, { status: 500 });
}