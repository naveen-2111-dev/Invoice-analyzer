import { GetCollection } from "@/lib/mongodb/link";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params; //report-id

    const collection = await GetCollection("reports");
    const report = await collection.findOne({ report_id: slug });

    if (!report) {
        return NextResponse.json({ error: "Report not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ report, success: true }, { status: 200 });
}