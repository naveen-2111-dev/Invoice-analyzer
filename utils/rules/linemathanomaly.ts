import { Invoice, LineMathAnomalyFindings } from "@/types/api";

export async function LineMathAnomaly(
    invoices: Partial<Invoice>[]
): Promise<{ rule: string; results: LineMathAnomalyFindings[] }> {
    const findings: LineMathAnomalyFindings[] = [];

    invoices.forEach((invoice, i) => {
        invoice.lines?.forEach((line, li) => {
            const qty = Number(line.qty) || 0;
            const unitPrice = Number(line.unit_price) || 0;
            const lineTotal = Number(line.line_total) || 0;
            const expected = qty * unitPrice;

            findings.push({
                invoice: invoice.inv_id ?? "unknown",
                ok: Math.abs(expected - lineTotal) <= 0.01,
                expected,
                got: lineTotal,
                index: i + 1,
                lineIndex: li + 1
            });
        });
    });

    return { rule: "LINE_MATH", results: findings };
}
