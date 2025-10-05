import moment from "moment";
import { Invoice, DateAnomalyFindings } from "@/types/api";

export async function DateAnomaly(
    invoices: Partial<Invoice>[]
): Promise<{ rule: string; results: DateAnomalyFindings[] }> {
    const findings: DateAnomalyFindings[] = [];

    invoices.forEach((inv, i) => {
        const date = inv.date;
        if (!date) {
            findings.push({
                invoice: inv.inv_id ?? "unknown",
                ok: false,
                expected: "YYYY-MM-DD",
                got: "missing",
                index: i + 1
            });
            return;
        }

        const ok = moment(date, ["YYYY-MM-DD", "YYYY/MM/DD"], true).isValid();

        findings.push({
            invoice: inv.inv_id ?? "unknown",
            ok,
            expected: "YYYY-MM-DD | YYYY/MM/DD",
            got: date,
            index: i + 1
        });
    });

    return { rule: "DATE_ANOMALY", results: findings };
}
