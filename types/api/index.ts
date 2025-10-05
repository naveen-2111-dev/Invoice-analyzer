interface Questionnaire {
    webhooks: boolean;
    sandbox_env: boolean;
    retries: boolean;
}

interface Record {
    inv_no: string,
    issued_on: string,
    curr: string,
    sellerName: string,
    sellerTax: string,
    buyerName: string,
    buyerTax: string,
    totalNet: string,
    vat: string,
    grandTotal: string,
    lineSku: string,
    lineQty: string,
    linePrice: string,
    lineTotal: string,
    buyerCountry: string
}

type Line = {
    sku: string,
    qty: number,
    unit_price: number,
    line_total: number,
    description: string
}

interface Invoice {
    inv_id: string,
    date: string,
    currency: string,
    seller_name: string,
    seller_trn: string,
    buyer_name: string,
    buyer_trn: string,
    total_excl_vat: string,
    vat_amount: string,
    total_incl_vat: string,
    buyer_country: string,
    lines: Line[]
}

type uploadDocType = {
    uploadId: string,
    uploadedAt: Date,
    recordCount: number,
    data: Partial<Invoice>[]
};

interface Findings<T = string | number> {
    invoice: string,
    ok: boolean,
    expected: T,
    got: T,
    index: number
}

interface NullAnomalyFindings extends Findings<{
    buyer_trn: string | null;
    seller_trn: string | null;
}> {
    expected: {
        buyer_trn: string | null;
        seller_trn: string | null;
    };
    got: {
        buyer_trn: string | null;
        seller_trn: string | null;
    };
}

interface LineMathAnomalyFindings extends Findings {
    lineIndex: number;
}

export type {
    Questionnaire,
    Invoice,
    Record,
    Line,
    uploadDocType,
    Findings as TotalBalanceFindings,
    Findings as DateAnomalyFindings,
    Findings as CurrencyAnomalyFindings,
    LineMathAnomalyFindings,
    NullAnomalyFindings
};