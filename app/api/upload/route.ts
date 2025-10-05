import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { GetCollection } from "@/lib/mongodb/link";
import { randomUUID } from "crypto";

import { record, uploadDocType } from "@/types/api";
import { TransformCSVToNestedJson } from "@/utils/csvtonestedJson";
import { compareSample } from "@/utils/_helper";

//Row limit for both csv and json files
const MAX_ROWS = 200;

/**
 * @function POST
 * @param request @type {NextRequest}
 * @description Handles file uploads, processes
 * CSV and JSON files, and stores their content as JSON in MongoDB.
 * @returns @type {NextResponse}
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file = data.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer()).toString("utf-8");
        const fileType = file.type || "";

        let records = [];

        if (fileType === "text/csv" || file.name.endsWith(".csv")) {
            const parsedRecords = parse(buffer, {
                columns: true,
                skip_empty_lines: true,
                to: MAX_ROWS
            });

            records = TransformCSVToNestedJson(parsedRecords as record[]);
        } //handls all csv related activities

        else if (fileType === "application/json" || file.name.endsWith(".json")) {
            const jsonData = JSON.parse(buffer);
            records = Array.isArray(jsonData) ? jsonData.slice(0, MAX_ROWS) : [jsonData];
        } //handles all json related activities

        else {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        } // exception handling for unsupported file types

        if (records.length === 0) {
            return NextResponse.json({ message: "No records to insert" }, { status: 200 });
        }

        const uploadId = randomUUID();
        const uploadDoc = {
            uploadId,
            uploadedAt: new Date(),
            recordCount: records.length,
            data: records
        };

        const collection = await GetCollection<uploadDocType>("uploads");
        const result = await collection.insertOne(uploadDoc);

        return NextResponse.json({
            message: "File processed successfully",
            insertedId: result.insertedId,
            uploadId,
            recordCount: records.length,
            records: records.slice(0, 20)
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}