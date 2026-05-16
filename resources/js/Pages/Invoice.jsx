import { Head } from '@inertiajs/react';

export default function Invoice({ data }) {
    const invoiceId = data ? data.id.replace('#', '') : '10470';
    const customerName = data ? data.name : 'Cash';
    const dateStr = data ? data.date : 'December 10, 2026';
    const terms = data && data.terms ? data.terms : 'Cash';
    const items = data && data.items ? data.items : [
        { code: 'MWVV3AM/A', description: '20W USB-C Power Adapter(2024)', unitCost: 1290, qty: 1 },
        { code: 'PMC0001SML', description: 'Paper Bag Small', unitCost: 0, qty: 1 }
    ];

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.unitCost) * Number(item.qty)), 0);
    const vatableSales = totalAmount / 1.12;
    const vat = totalAmount - vatableSales;

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:py-0 print:bg-white flex justify-center">
            <Head title="Sales Invoice" />

            <div className="bg-white w-full max-w-[850px] shadow-xl print:shadow-none p-8 md:p-12 text-[11px] leading-snug font-sans text-black relative">

                {/* Faint Stamp */}
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 text-gray-300 tracking-widest text-lg font-bold opacity-50 pointer-events-none">
                    SJMPC001S009604
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-1/2">
                        <div className="flex items-baseline gap-1">
                            <h1 className="font-serif font-bold text-xl tracking-tight">PODWORX</h1>
                            <span className="italic text-[10px]">Owned & Operated by:</span>
                        </div>
                        <h2 className="font-serif font-bold text-lg leading-tight">PMC EXPRESS HUB INC.</h2>
                        <p className="mt-1 w-[90%]">
                            CZ05-06, CZ15-CZ16, 3rd Floor, Cyberzone, SM City J Mall,
                            165 A.S. Fortuna St., Bakilid, 6014 City of Mandaue, Cebu, Philippines
                        </p>
                        <p className="mt-1 font-bold">VAT Reg. TIN: 007-183-030-00026</p>
                    </div>

                    <div className="w-1/2 text-right relative">
                        {/* Faint text above Sales Invoice */}
                        <div className="absolute top-[-10px] right-0 text-gray-400 italic text-xs opacity-60">
                            A ... 199021-15-01
                        </div>
                        <h1 className="font-serif font-bold text-2xl tracking-widest mb-1">SALES INVOICE</h1>
                        <div className="flex justify-end items-center gap-2 mb-2">
                            <span className="font-serif font-bold text-lg">No.</span>
                            <span className="font-serif text-red-600 font-bold text-xl">{invoiceId}</span>
                        </div>
                        <div className="flex justify-end items-baseline gap-1">
                            <span>DATE:</span>
                            <span className="text-gray-500 underline decoration-gray-300 underline-offset-2">{dateStr}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info Box */}
                <div className="border border-black mb-2 flex flex-col">
                    {/* Top Row */}
                    <div className="flex border-b border-black">
                        <div className="w-[30%] border-r border-black p-1 pb-4">
                            <div>Sold to:</div>
                            <div className="text-gray-500 uppercase mt-1 px-4">{customerName}</div>
                        </div>
                        <div className="w-[35%] border-r border-black p-1 pb-4">
                            <div>Shipping Address:</div>
                            <div className="text-gray-500 uppercase mt-1 px-4">{data && data.shippingAddress ? data.shippingAddress : 'Refused To Register In OA'}</div>
                        </div>
                        <div className="w-[15%] border-r border-black p-1">
                            <div>Contact:</div>
                            <div className="text-gray-500 uppercase mt-1 px-2">{data && data.contact ? data.contact : '-'}</div>
                        </div>
                        <div className="w-[20%] p-1 relative">
                            <div>PO: <span className="text-gray-500">{data && data.poNumber ? data.poNumber : '-'}</span></div>
                            <div className="absolute bottom-1 left-1 text-[10px] text-gray-500 flex flex-col gap-0.5">
                                <div>Cashier <span className="ml-2">: {data && data.cashier ? data.cashier : 'SMADRID'}</span></div>
                                <div>Sales Person <span className="ml-1">: {data && data.salesPerson ? data.salesPerson : 'ANTORRES'}</span></div>
                            </div>
                        </div>
                    </div>
                    {/* Bottom Row */}
                    <div className="flex">
                        <div className="w-[30%] border-r border-black p-1">
                            <div>TIN: <span className="text-gray-500 ml-2">{data && data.tin ? data.tin : '-'}</span></div>
                        </div>
                        <div className="flex-1 p-1">
                            <div>Terms: <span className="text-gray-500 uppercase ml-2">{terms}</span></div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="border-x border-black min-h-[300px] flex flex-col relative">
                    {/* Table Header */}
                    <div className="bg-black text-white flex font-bold border-b border-black">
                        <div className="w-[20%] p-1.5 border-r border-white">Product Code</div>
                        <div className="flex-1 p-1.5 border-r border-white">Description</div>
                        <div className="w-[15%] p-1.5 border-r border-white text-center">Unit Cost</div>
                        <div className="w-[8%] p-1.5 border-r border-white text-center">Qty.</div>
                        <div className="w-[18%] p-1.5 text-center">Total</div>
                    </div>

                    {/* Table Body (Items) */}
                    <div className="flex-1">
                        {items.map((item, index) => (
                            <div key={index} className="flex px-1 py-4 text-gray-500 uppercase font-medium tracking-wider">
                                <div className="w-[20%] pl-2 truncate">{item.code || '-'}</div>
                                <div className="flex-1 pr-4 truncate">
                                    <div>{item.description || '-'}</div>
                                </div>
                                <div className="w-[15%] text-right pr-4">{Number(item.unitCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <div className="w-[8%] text-center">{item.qty}</div>
                                <div className="w-[18%] text-right pr-6">{(Number(item.unitCost) * Number(item.qty)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="border-t border-black pt-2 flex">
                    {/* Left Legal Text */}
                    <div className="w-[55%] pr-4 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start gap-1 text-[9px] leading-[1.1] text-justify mb-2">
                                <span className="font-bold">TERMS:</span>
                                <span>
                                    Merchandise covered by this invoice remain the property of PMC Express Hub Inc.
                                    until fully paid for, and buyer assumes responsibility in case of loss by theft, fire, etc. All
                                    prices are understood to be F.O.B. City of Mandaue. Freight, postage and collection
                                    charges if prepaid by the seller shall be for the account of the buyer. We are not responsible
                                    for any loss or damage due to leakage, breakage, or any cause after delivery of shipment
                                    by us in good order and condition to carrier. Parties submit themselves to the jurisdiction
                                    of the court of City of Mandaue in any legal action arising out of this transaction.
                                    Interest rate of 36% per annum is charged on overdue accounts. In case of suit, attorney's
                                    fee and cost of collection are understood to be for the account of buyer.
                                </span>
                            </div>

                            <div className="flex items-start gap-2 text-[9px] leading-[1.1] text-justify relative mt-3 mb-6">
                                <div className="border border-black rounded-[50%] px-2 py-0.5 absolute -left-2 -top-1">NOTE:</div>
                                <span className="ml-10">
                                    Products returned within acceptable parameters as stated in our Return and Exchange
                                    Policy, but not in its original state or without its sealed packaging will be charged a 25%
                                    restocking fee.
                                </span>
                            </div>

                            <div className="mt-8 flex items-end gap-2 pl-8 relative">
                                <span>Signature</span>
                                <div className="border-b border-black w-48 relative">

                                </div>
                            </div>
                        </div>

                        {/* Faint BIR text at very bottom */}
                        <div className="text-[6px] text-gray-500 leading-tight mt-6">
                            20 Boxes 500 sets/pad (x3) SN 10001-20000 BIR Authority to Print No. OCN980AU2025000000578 Date of ATP 01-15-2025<br />
                            Printed by: Jose B. Sancales, Jr./San Jose Printing Press 707 Pres. Quirino Ave. Brgy 708, Zone 077 Malate, Manila VAT Reg TIN: 104-878-878-00000<br />
                            Printer's Accreditation No. 033MP20240000000001 Accreditation Date 02-25-2024 Expiry Date 02-25-2029<br />
                            Loose-Leaf Permit No. ELLR-043-1524-275 Date of Issue 10-05-2024
                        </div>
                    </div>

                    {/* Right Totals Section */}
                    <div className="w-[45%] flex text-[10px]">
                        {/* VAT Info */}
                        <div className="w-[40%] text-right pr-2 space-y-1">
                            <div>VATable Sales</div>
                            <div>VAT</div>
                            <div>Zero-Rated Sales</div>
                            <div>VAT-Exempt Sales</div>
                        </div>
                        {/* PHP Column */}
                        <div className="w-[15%] text-gray-400 space-y-1">
                            <div>PHP</div>
                            <div>PHP</div>
                            <div>PHP</div>
                            <div>PHP</div>
                        </div>
                        {/* Totals Label Column */}
                        <div className="w-[25%] space-y-1">
                            <div className="font-bold leading-tight">Total Sales<br /><span className="text-[8px] font-normal">(VAT Inclusive)</span></div>
                            <div className="pt-2">Less: VAT</div>
                            <div className="pt-1">Amount Net of VAT</div>
                            <div className="pt-1 leading-tight">Less: Discount<br /><span className="text-[8px]">[SC/PWD/NAAC/MOV/SP]</span></div>
                            <div className="pt-2">Add: VAT</div>
                            <div className="pt-4">Less: Withholding Tax</div>
                        </div>
                        {/* Values Column */}
                        <div className="w-[20%] text-right text-gray-500 space-y-1 relative">
                            <div className="pt-1">{vatableSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="pt-3">0.00</div>
                            <div className="pt-1">0.00</div>
                            <div className="pt-3">{vat.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="pt-2">0.00</div>
                            <div className="pt-4">{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>
                </div>

                {/* Final Totals & Signatures at bottom right */}
                <div className="absolute bottom-8 right-12 text-right text-[10px] w-64 space-y-4">
                    <div className="font-bold text-sm">TOTAL AMOUNT DUE</div>

                    <div className="pt-2 flex flex-col items-end">
                        <div className="border-b border-black w-40 mb-1"></div>
                        <div>SC/PWD/NAAC/MOV/SP<br />ID No.</div>
                    </div>

                    <div className="pt-2 flex flex-col items-end">
                        <div className="border-b border-black w-40 mb-1"></div>
                        <div>SC/PWD/NAAC/MOV/SP<br />Signature</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
