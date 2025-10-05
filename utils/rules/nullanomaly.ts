import { Invoice, NullAnomalyFindings } from "@/types/api";

export async function NullAnomaly(
    invoices: Partial<Invoice>[]
): Promise<{ rule: string; results: NullAnomalyFindings[] }> {
    const findings: NullAnomalyFindings[] = [];

    invoices.forEach((invoice, i) => {
        const buyer = invoice.buyer_trn;
        const seller = invoice.seller_trn;

        if (buyer === undefined ||
            seller === undefined ||
            buyer === null ||
            seller === null ||
            buyer === "" ||
            seller === "") {
            findings.push({
                invoice: invoice.inv_id ?? "unknown",
                ok: true,
                expected: {
                    buyer_trn: null,
                    seller_trn: null,
                },
                got: {
                    buyer_trn: null,
                    seller_trn: null
                },
                index: i + 1
            });
            return;
        }

        findings.push({
            invoice: invoice.inv_id ?? "unknown",
            ok: false,
            expected: {
                buyer_trn: buyer,
                seller_trn: seller
            },
            got: {
                buyer_trn: buyer,
                seller_trn: seller
            },
            index: i + 1
        });
    });

    return { rule: "NULL_ANOMALY", results: findings };
}
