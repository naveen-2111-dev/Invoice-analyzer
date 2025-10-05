"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Invoice } from "@/types/api";

export function PreviewTable({ res: invoices }: { res: Invoice[] }) {
    return (
        <Table>
            <TableCaption>A list 20 invoice records.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Seller Name</TableHead>
                    <TableHead>Seller Trn</TableHead>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Buyer Trn</TableHead>
                    <TableHead>Total Excl Vat</TableHead>
                    <TableHead>Vat Amount</TableHead>
                    <TableHead>Total Incl Vat</TableHead>
                    <TableHead>Buyer Country</TableHead>
                    <TableHead>Lines</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.inv_id}>
                        <TableCell className="font-medium">{invoice.inv_id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.currency}</TableCell>
                        <TableCell>{invoice.seller_name}</TableCell>
                        <TableCell>{invoice.seller_trn}</TableCell>
                        <TableCell>{invoice.buyer_name}</TableCell>
                        <TableCell>{invoice.buyer_trn}</TableCell>
                        <TableCell>{invoice.total_excl_vat}</TableCell>
                        <TableCell>{invoice.vat_amount}</TableCell>
                        <TableCell>{invoice.total_incl_vat}</TableCell>
                        <TableCell>{invoice.buyer_country}</TableCell>
                        <TableCell>...</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
