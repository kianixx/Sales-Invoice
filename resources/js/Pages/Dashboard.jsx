import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Invoice from './Invoice';

const mockInvoices = [
    { id: '#10470', name: 'Cash', date: 'December 10, 2026', amount: 'PHP 1,290.00', status: 'Paid', avatar: 'https://i.pravatar.cc/150?u=cash1' },
    { id: '#10469', name: 'Maria Santos', date: 'December 09, 2026', amount: 'PHP 75,990.00', status: 'Paid', avatar: 'https://i.pravatar.cc/150?u=maria' },
    { id: '#10468', name: 'Juan Dela Cruz', date: 'December 08, 2026', amount: 'PHP 14,990.00', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=juan' },
    { id: '#10467', name: 'Cash', date: 'December 08, 2026', amount: 'PHP 89,990.00', status: 'Paid', avatar: 'https://i.pravatar.cc/150?u=cash2' },
    { id: '#10466', name: 'Jose Rizal', date: 'December 07, 2026', amount: 'PHP 1,290.00', status: 'Paid', avatar: 'https://i.pravatar.cc/150?u=jose' },
];

export default function Dashboard() {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f5f5f7] font-sans text-gray-800">
            <Head title="Dashboard" />

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">

                {/* Logo */}
                <div className="flex items-center px-8 h-20 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-black">
                            PMC Finance
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Inspired by Power Mac Center
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 space-y-2">

                    {/* Dashboard */}
                    <button
                        onClick={() => setActiveMenu('Dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${activeMenu === 'Dashboard'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>

                        Dashboard
                    </button>

                    {/* Invoice */}
                    <button
                        onClick={() => setActiveMenu('Invoices')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${activeMenu === 'Invoices'
                            ? 'bg-black text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>

                        Invoice
                    </button>
                </div>

                {/* User */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                        <img
                            src="https://mindandculture.org/wordpress6/wp-content/uploads/2018/06/Fotolia_188161178_XS.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>
                            <p className="text-sm font-semibold text-black">
                                Admin
                            </p>
                            <p className="text-xs text-gray-500">
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                    <h1 className="text-2xl font-semibold text-black">
                        {activeMenu}
                    </h1>

                    <div className="flex items-center gap-4">

                        <div className="relative hidden md:block">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:ring-0 border-none w-72"
                            />
                        </div>

                        <img
                            src="https://mindandculture.org/wordpress6/wp-content/uploads/2018/06/Fotolia_188161178_XS.jpg"
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">

                    {activeMenu === 'Dashboard' ? (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-2">
                                    Total Revenue
                                </p>

                                <h2 className="text-3xl font-semibold text-black">
                                    $245,000
                                </h2>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-2">
                                    Total Invoices
                                </p>

                                <h2 className="text-3xl font-semibold text-black">
                                    128
                                </h2>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <p className="text-sm text-gray-500 mb-2">
                                    Pending Payments
                                </p>

                                <h2 className="text-3xl font-semibold text-black">
                                    14
                                </h2>
                            </div>

                        </div>

                    ) : (

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                            {/* Toolbar */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">

                                <div className="relative">
                                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>

                                    <input
                                        type="text"
                                        placeholder="Search invoice"
                                        className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm border-none w-64"
                                    />
                                </div>

                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
                                >
                                    Create Invoice
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">

                                <table className="w-full text-sm text-left">

                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs">

                                        <tr>
                                            <th className="px-6 py-4">Invoice</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {mockInvoices.map((invoice) => (

                                            <tr
                                                key={invoice.id}
                                                className="border-t border-gray-100 hover:bg-gray-50 transition"
                                            >

                                                <td className="px-6 py-5 font-medium text-black">
                                                    {invoice.id}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span className="font-medium text-gray-800">
                                                        {invoice.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-gray-500">
                                                    {invoice.date}
                                                </td>

                                                <td className="px-6 py-5 font-medium text-black">
                                                    {invoice.amount}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {invoice.status === 'Paid' ? (
                                                        <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-xs font-medium">
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">

                                                        {/* View */}
                                                        <button
                                                            onClick={() => setSelectedInvoice(invoice)}
                                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>

                                                            View
                                                        </button>

                                                        {/* Edit */}
                                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>

                                                            Edit
                                                        </button>

                                                        {/* Delete */}
                                                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>

                                                            Delete
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </div>

            </main>

            {/* Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)}></div>
                    <div className="bg-gray-100 rounded-lg shadow-2xl w-full max-w-[900px] h-[90vh] overflow-y-auto relative z-10 transform transition-all">
                        <button
                            onClick={() => setSelectedInvoice(null)}
                            className="absolute top-4 right-4 z-[60] bg-gray-200/50 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="scale-[0.9] origin-top md:scale-100 mt-8 md:mt-0">
                            <Invoice />
                        </div>
                    </div>
                </div>
            )}

            {/* Create Invoice Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 transform transition-all max-h-[95vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="text-xl font-semibold text-black">Create New Invoice</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setIsCreateModalOpen(false); }}>

                                {/* Header Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice No.</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50 text-gray-500 font-medium" value="10471" readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                                        <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Customer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sold To</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Kiana Cirilo" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Address</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Metro Manila" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. 0917-123-4567" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">TIN</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="000-000-000-000" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Sales Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">PO Number</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="PO-" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Terms</label>
                                            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-white">
                                                <option>COD</option>
                                                <option>30 Days</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cashier</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. SMADRID" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sales Person</label>
                                            <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. ANTORRES" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Line Items</h4>
                                        <button type="button" className="text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">+ Add Item</button>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-inner">
                                        <div className="grid grid-cols-12 gap-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                                            <div className="col-span-3">Product Code</div>
                                            <div className="col-span-4">Description</div>
                                            <div className="col-span-2">Unit Cost</div>
                                            <div className="col-span-1 text-center">Qty</div>
                                            <div className="col-span-2 text-right">Total</div>
                                        </div>
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3">
                                                <input type="text" placeholder="e.g. MWVV3AM/A" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none bg-white" />
                                            </div>
                                            <div className="col-span-4">
                                                <input type="text" placeholder="20W USB-C Power Adapter" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none bg-white" />
                                            </div>
                                            <div className="col-span-2">
                                                <input type="number" placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none bg-white" />
                                            </div>
                                            <div className="col-span-1">
                                                <input type="number" placeholder="1" defaultValue="1" className="w-full border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none text-center bg-white" />
                                            </div>
                                            <div className="col-span-2">
                                                <input type="text" placeholder="0.00" readOnly className="w-full border-none bg-transparent px-3 py-2 text-sm text-gray-800 font-semibold outline-none text-right" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-3xl">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:opacity-90 transition shadow-md"
                            >
                                Generate Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}