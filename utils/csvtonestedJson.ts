
/**
 * @function TransformCSVToNested
 * @param records @type {any[]}
 * @description Transforms flat CSV records into a nested JSON structure.
 * as per the given structure in clean.json file
 * @returns invoice @type {any[]}
 */
function TransformCSVToNested(records: any[]): any[] {
    return records.map(row => {
        const invoice: any = {};
        const line: any = {};

        Object.keys(row).forEach(key => {
            const lowerKey = key.toLowerCase();

            if (lowerKey.includes('line') || lowerKey === 'sku' || lowerKey === 'qty' ||
                lowerKey === 'unit_price' || lowerKey === 'description') {
                if (key === 'lineSku' || key === 'sku') line.sku = row[key];
                else if (key === 'lineQty' || key === 'qty') line.qty = parseFloat(row[key]) || row[key];
                else if (key === 'linePrice' || key === 'unit_price') line.unit_price = parseFloat(row[key]) || row[key];
                else if (key === 'lineTotal' || key === 'line_total') line.line_total = parseFloat(row[key]) || row[key];
                else if (key === 'description') line.description = row[key];
            } else {
                invoice[key] = row[key];
            }
        });

        if (Object.keys(line).length > 0) {
            invoice.lines = [line];
        }

        return invoice;
    });
}

export { TransformCSVToNested };