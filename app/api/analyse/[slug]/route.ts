import { GetCollection } from "@/lib/mongodb/link";
import { Questionnaire, uploadDocType } from "@/types/api";
import { CurrencyAnomaly } from "@/utils/rules/currencyanomaly";
import { DateAnomaly } from "@/utils/rules/dateanomaly";
import { LineMathAnomaly } from "@/utils/rules/linemathanomaly";
import { NullAnomaly } from "@/utils/rules/nullanomaly";
import { TotalBalance } from "@/utils/rules/totalbalance";
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
    }

    if (!total) {
        return NextResponse.json({ error: "Total balance calculation failed" }, {
            status: 500,
        });
    }

    return NextResponse.json({ message: "Analysis complete", data: FinalAnalize }, {
        status: 200,
    });
}