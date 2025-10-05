import { Invoice, TotalBalanceFindings } from "@/types/api";

export async function TotalBalance(invoices: Partial<Invoice>[]): Promise<{ rule: string; results: TotalBalanceFindings[], allOk: boolean }> {
    const findings: TotalBalanceFindings[] = [];
    let allOk = true;

    invoices.forEach((inv, i) => {
        const total = Number(inv.total_excl_vat);
        const vat = Number(inv.vat_amount);
        const grand = Number(inv.total_incl_vat);

        const diff = Math.abs((total + vat) - grand);
        const ok = diff <= 0.01;

        if (!ok) allOk = false;

        findings.push({
            invoice: inv.inv_id ?? "unknown",
            ok: ok,
            expected: total + vat,
            got: grand,
            index: i + 1
        });
    });

    return { rule: "TOTALS_BALANCE", results: findings, allOk };
}
