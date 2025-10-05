import { Invoice, Line, record } from "@/types/api";
import { compareSample } from "./_helper";

export function TransformCSVToNestedJson(records: record[]): Invoice[] {
    return records.map(row => {
        const invoice: Invoice = {
            inv_id: row.inv_no || "",
            date: row.issued_on || "",
            currency: row.curr || "",
            seller_name: row.sellerName || "",
            seller_trn: row.sellerTax || "",
            buyer_name: row.buyerName || "",
            buyer_trn: row.buyerTax || "",
            total_excl_vat: row.totalNet || "",
            vat_amount: row.vat || "",
            total_incl_vat: row.grandTotal || "",
            buyer_country: row.buyerCountry || "",
            lines: []
        };

        const line: Line = {
            sku: row.lineSku || "",
            qty: parseFloat(row.lineQty) || 0,
            unit_price: parseFloat(row.linePrice) || 0,
            line_total: parseFloat(row.lineTotal) || 0,
            description: ""
        };

        if (line.sku || line.qty || line.line_total) {
            invoice.lines = [line];
        }

        return invoice;
    });
}