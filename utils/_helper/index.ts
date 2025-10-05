import { record } from "@/types/api";
import stringSimilarity from "string-similarity";

const samplejson = [
    "invoice.id",
    "invoice.issue_date",
    "invoice.currency",
    "invoice.total_excl_vat",
    "invoice.vat_amount",
    "invoice.total_incl_vat",
    "seller.name",
    "seller.trn",
    "seller.country",
    "seller.city",
    "buyer.name",
    "buyer.trn",
    "buyer.country",
    "buyer.city",
    "lines[].sku",
    "lines[].description",
    "lines[].qty",
    "lines[].unit_price",
    "lines[].line_total"
];

function flattenKeys(obj: any, parentKey = ""): string[] {
    const keys: string[] = [];
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === "object") {
                const arrayKeys = flattenKeys(value[0], `${newKey.replace(/\.\d+$/, "")}[]`);
                keys.push(...arrayKeys);
            } else {
                keys.push(`${newKey}[]`);
            }
        } else if (typeof value === "object" && value !== null) {
            keys.push(...flattenKeys(value, newKey));
        } else {
            keys.push(newKey);
        }
    }
    return keys;
}

export function compareSample(uploadedInvoice: record[]) {
    const invoices = uploadedInvoice

    const finalMatched = new Set<string>();
    const finalCloseMap = new Map<string, { candidate: string; confidence: number }>();
    const finalMissing = new Set<string>();

    for (const invoice of invoices) {
        const uploadedKeys = flattenKeys(invoice);

        for (const sampleKey of samplejson) {
            if (uploadedKeys.includes(sampleKey)) {
                finalMatched.add(sampleKey);
            } else {
                const { bestMatch } = stringSimilarity.findBestMatch(sampleKey, uploadedKeys);
                if (bestMatch.rating >= 0.6) {
                    if (!finalCloseMap.has(sampleKey) || finalCloseMap.get(sampleKey)!.confidence < bestMatch.rating) {
                        finalCloseMap.set(sampleKey, {
                            candidate: bestMatch.target,
                            confidence: parseFloat(bestMatch.rating.toFixed(2)),
                        });
                    }
                } else {
                    finalMissing.add(sampleKey);
                }
            }
        }
    }

    const total = samplejson.length;
    const matchedScore = finalMatched.size * 1.0;
    const closeScore = finalCloseMap.size * 0.5;
    const coverage = ((matchedScore + closeScore) / total) * 100;
    const coverageScore = parseFloat(coverage.toFixed(2));

    return {
        matched: Array.from(finalMatched),
        close: Array.from(finalCloseMap.entries()).map(([target, { candidate, confidence }]) => ({
            target,
            candidate,
            confidence,
        })),
        missing: Array.from(finalMissing),
        coverageScore,
    };
}
