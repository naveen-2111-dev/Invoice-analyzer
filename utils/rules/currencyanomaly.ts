import { Invoice, CurrencyAnomalyFindings } from "@/types/api";

export const ACCEPTED_CURRENCIES: string[] = ["AED", "SAR", "MYR", "USD"];

export async function CurrencyAnomaly(
    invoices: Partial<Invoice>[]
): Promise<{ rule: string; results: CurrencyAnomalyFindings[], allOk: boolean }> {
    const findings: CurrencyAnomalyFindings[] = [];
    let allOk = true;

    invoices.forEach((invoice, i) => {
        const currency = invoice.currency;

        if (!currency) {
            findings.push({
                invoice: invoice.inv_id ?? "unknown",
                ok: false,
                expected: "AED | SAR | MYR | USD",
                got: "missing",
                index: i + 1
            });
            return;
        }

        const ok = ACCEPTED_CURRENCIES.includes(currency);
        if (!ok) allOk = false;

        findings.push({
            invoice: invoice.inv_id ?? "unknown",
            ok,
            expected: "AED | SAR | MYR | USD",
            got: currency,
            index: i + 1
        });
    });

    return { rule: "CURRENCY_ANOMALY", results: findings, allOk };
}
