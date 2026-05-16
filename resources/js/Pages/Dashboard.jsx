import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Invoice from './Invoice';
import Inventory from './Inventory';
import Reports from './Reports';



const RevenueChart = ({ data }) => {
    const max = Math.max(...data.map(d => d.amount), 1);
    const points = data.map((d, i) => `${(i * 100) / (data.length - 1)},${100 - (d.amount / max) * 80}`).join(' ');
    const areaPoints = `0,100 ${points} 100,100`;

    return (
        <div className="w-full h-48 relative mt-4">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="black" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="black" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={areaPoints} fill="url(#chartGradient)" />
                <polyline
                    fill="none"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
            </svg>
            <div className="flex justify-between mt-2 px-1">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{d.day}</span>
                ))}
            </div>
        </div>
    );
};

const CategoryDonut = ({ data }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const colors = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'];
    let currentOffset = 0;

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    {Object.entries(data).map(([cat, val], i) => {
                        const pct = (val / total) * 100;
                        const stroke = (pct * 100) / 100;
                        const dash = `${stroke} ${100 - stroke}`;
                        const offset = -currentOffset;
                        currentOffset += stroke;
                        return (
                            <circle
                                key={cat}
                                cx="18"
                                cy="18"
                                r="15.915"
                                fill="transparent"
                                stroke={colors[i % colors.length]}
                                strokeWidth="4"
                                strokeDasharray={dash}
                                strokeDashoffset={offset}
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-black">{total}</span>
                    <span className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Sold</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(data).map(([cat, val], i) => (
                    <div key={cat} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        <span className="text-[10px] font-medium text-gray-600 truncate max-w-[80px]">{cat}</span>
                        <span className="text-[10px] font-bold text-black">{Math.round((val / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Dashboard({ auth, initialInventory = [], initialInvoices = [] }) {
    const userRole = auth?.user?.role || 'admin';
    const [activeMenu, setActiveMenu] = useState(userRole === 'cashier' ? 'Invoices' : 'Dashboard');
    const [invoices, setInvoices] = useState(initialInvoices);
    const [inventory, setInventory] = useState(initialInventory);

    // Sync state with props when database changes
    useEffect(() => {
        setInventory(initialInventory);
        setInvoices(initialInvoices);
    }, [initialInventory, initialInvoices]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingInvoiceId, setEditingInvoiceId] = useState(null);
    const [invoiceSearch, setInvoiceSearch] = useState('');

    // Invoice Form State
    const [invoiceForm, setInvoiceForm] = useState({
        customerName: '',
        shippingAddress: '',
        contact: '',
        tin: '',
        poNumber: '',
        cashier: '',
        salesPerson: '',
        date: new Date().toISOString().split('T')[0],
        terms: 'Cash',
        installmentDuration: ''
    });
    const [lineItems, setLineItems] = useState([
        { code: '', description: '', unitCost: '', qty: 1 }
    ]);

    const handleAddLineItem = () => {
        setLineItems([...lineItems, { code: '', description: '', unitCost: '', qty: 1 }]);
    };

    const handleProductSelect = (index, productId) => {
        // Validation: do not allow adding the same item in separate rows
        const existingIndex = lineItems.findIndex((item, i) => i !== index && item.code === productId);
        
        if (existingIndex !== -1) {
            alert('This item is already added. Please update the quantity of the existing row.');
            return;
        }

        const product = inventory.find(p => p.id === productId);
        const newItems = [...lineItems];
        if (product) {
            newItems[index].code = product.id;
            newItems[index].description = product.name;
            newItems[index].unitCost = parseFloat(product.price.replace(/PHP\s|,/g, ''));
            // Check initial stock
            if (Number(newItems[index].qty) > product.onHand) {
                newItems[index].stockError = `Only ${product.onHand} left`;
            } else {
                newItems[index].stockError = null;
            }
        } else {
            newItems[index].code = '';
            newItems[index].description = '';
            newItems[index].unitCost = '';
            newItems[index].stockError = null;
        }
        setLineItems(newItems);
    };

    const handleLineItemChange = (index, field, value) => {
        if (field === 'qty' && value !== '' && Number(value) < 0) {
            return;
        }
        const newItems = [...lineItems];
        newItems[index][field] = value;

        // Live Stock Validation
        if (field === 'qty' || field === 'code') {
            const product = inventory.find(p => p.id === newItems[index].code);
            if (product && Number(newItems[index].qty) > product.onHand) {
                newItems[index].stockError = `Only ${product.onHand} left`;
            } else {
                newItems[index].stockError = null;
            }
        }

        setLineItems(newItems);
    };

    const calculateTotal = () => {
        return lineItems.reduce((sum, item) => sum + (parseFloat(item.unitCost || 0) * parseInt(item.qty || 0)), 0);
    };

    const handleDeleteInvoice = (id) => {
        if (window.confirm(`Are you sure you want to delete invoice ${id}? This action cannot be undone.`)) {
            router.delete(route('invoice.destroy', id.replace('#', '')), {
                onSuccess: () => {
                    // Success is handled by the backend redirect
                },
                onError: (errors) => {
                    console.error(errors);
                    alert("An error occurred while deleting the invoice.");
                }
            });
        }
    };

    const handleEditInvoice = (invoice) => {
        setIsEditing(true);
        setEditingInvoiceId(invoice.id);
        setInvoiceForm({
            customerName: invoice.name,
            shippingAddress: invoice.shippingAddress || '',
            contact: invoice.contact || '',
            tin: invoice.tin || '',
            poNumber: invoice.poNumber || '',
            cashier: invoice.cashier || '',
            salesPerson: invoice.salesPerson || '',
            date: invoice.rawDate || new Date().toISOString().split('T')[0],
            terms: invoice.terms || 'Cash',
            installmentDuration: invoice.installmentDuration || ''
        });
        setLineItems(invoice.items && invoice.items.length > 0
            ? invoice.items
            : [{ code: '', description: '', unitCost: '', qty: 1 }]
        );
        setIsCreateModalOpen(true);
    };

    const handleCreateInvoice = () => {
        // Validation: Ensure no stock errors
        const hasStockError = lineItems.some(item => item.stockError);
        if (hasStockError) {
            alert('Please resolve stock issues before generating the invoice.');
            return;
        }

        const dataToSubmit = {
            ...invoiceForm,
            items: lineItems
        };

        if (isEditing && editingInvoiceId) {
            router.put(route('invoice.update', editingInvoiceId.replace('#', '')), dataToSubmit, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setIsEditing(false);
                    setEditingInvoiceId(null);
                    setInvoiceForm({ 
                        customerName: '', 
                        shippingAddress: '',
                        contact: '',
                        tin: '',
                        poNumber: '',
                        cashier: '',
                        salesPerson: '',
                        date: new Date().toISOString().split('T')[0], 
                        terms: 'Cash', 
                        installmentDuration: '' 
                    });
                    setLineItems([{ code: '', description: '', unitCost: '', qty: 1 }]);
                },
                onError: (errors) => {
                    console.error(errors);
                    alert('Error updating invoice. Please check the inputs.');
                }
            });
        } else {
            router.post(route('invoice.store'), dataToSubmit, {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setInvoiceForm({ 
                        customerName: '', 
                        shippingAddress: '',
                        contact: '',
                        tin: '',
                        poNumber: '',
                        cashier: '',
                        salesPerson: '',
                        date: new Date().toISOString().split('T')[0], 
                        terms: 'Cash', 
                        installmentDuration: '' 
                    });
                    setLineItems([{ code: '', description: '', unitCost: '', qty: 1 }]);
                },
                onError: (errors) => {
                    console.error(errors);
                    alert('Error saving invoice. Please check the inputs.');
                }
            });
        }
    };

    // --- Dashboard computed stats ---
    const dashTotalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/PHP\s|,/g, '')), 0);
    const dashPendingCount = invoices.filter(inv => inv.status === 'Pending').length;
    const dashTotalInvValue = inventory.reduce((sum, item) => sum + parseFloat(item.price.replace(/PHP\s|,/g, '')) * item.onHand, 0);
    const dashTotalUnitsSold = inventory.reduce((sum, item) => sum + item.sold, 0);
    const dashTotalOnHand = inventory.reduce((sum, item) => sum + item.onHand, 0);
    const dashLowStock = inventory.filter(item => item.onHand < 15).sort((a, b) => a.onHand - b.onHand);
    const dashTopProducts = [...inventory].sort((a, b) => b.onHand - a.onHand).slice(0, 4);
    const dashMaxOnHand = Math.max(...inventory.map(i => i.onHand), 1);
    const dashRecentInvoices = invoices.slice(0, 5);

    // Calculate sales history for the last 7 days
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesHistory = days.map(day => {
        const dayInvoices = invoices.filter(inv => {
            const invDate = new Date(inv.rawDate);
            return days[invDate.getDay()] === day;
        });
        const amount = dayInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/PHP\s|,/g, '')), 0);
        return { day, amount };
    });

    // Reorder to put today at the end
    const today = new Date().getDay();
    const orderedSalesHistory = [];
    for (let i = 1; i <= 7; i++) {
        const index = (today + i) % 7;
        orderedSalesHistory.push(salesHistory[index]);
    }


    const categoryStats = inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.sold;
        return acc;
    }, {});
    const filteredInvoicesList = invoices.filter(inv => 
        inv.name.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.id.toLowerCase().includes(invoiceSearch.toLowerCase())
    );

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
                    {userRole !== 'cashier' && (
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
                    )}

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

                    {/* Inventory */}
                    {userRole !== 'cashier' && (
                        <button
                            onClick={() => setActiveMenu('Inventory')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${activeMenu === 'Inventory'
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>

                            Inventory
                        </button>
                    )}

                    {/* Reports */}
                    {userRole !== 'cashier' && (
                        <button
                            onClick={() => setActiveMenu('Reports')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${activeMenu === 'Reports'
                                ? 'bg-black text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>

                            Reports
                        </button>
                    )}
                </div>

                {/* User */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between gap-3 bg-gray-50 rounded-2xl p-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://mindandculture.org/wordpress6/wp-content/uploads/2018/06/Fotolia_188161178_XS.jpg"
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-semibold text-black capitalize">
                                    {auth?.user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {userRole}
                                </p>
                            </div>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="text-gray-400 hover:text-red-500 transition" title="Log Out">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
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

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">

                    {activeMenu === 'Dashboard' ? (

                        <div className="flex flex-col gap-6">

                            {/* ── KPI Cards ── */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-black text-white rounded-3xl p-6 shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Revenue</p>
                                    <h2 className="text-2xl font-bold leading-tight">PHP {dashTotalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                    <p className="text-xs text-gray-400">from {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Total Invoices</p>
                                    <h2 className="text-2xl font-bold text-black">{invoices.length}</h2>
                                    <p className="text-xs text-gray-400">{dashPendingCount} pending</p>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Inventory Value</p>
                                    <h2 className="text-2xl font-bold text-black">PHP {dashTotalInvValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                    <p className="text-xs text-gray-400">{inventory.length} product types</p>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Units Sold</p>
                                    <h2 className="text-2xl font-bold text-black">{dashTotalUnitsSold.toLocaleString()}</h2>
                                    <p className="text-xs text-gray-400">{dashTotalOnHand} units on hand</p>
                                </div>
                            </div>

                            {/* ── Charts Section ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Revenue Trend */}
                                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-black">Revenue Trend</h3>
                                            <p className="text-xs text-gray-400">Weekly performance summary</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 bg-black rounded-full"></span>
                                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Gross Sales</span>
                                        </div>
                                    </div>
                                    <RevenueChart data={orderedSalesHistory} />
                                </div>

                                {/* Category Performance */}
                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-bold text-black mb-1">Top Categories</h3>
                                    <p className="text-xs text-gray-400 mb-8">Sales by product type</p>
                                    <CategoryDonut data={categoryStats} />
                                </div>
                            </div>

                            {/* ── Middle Row ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                                {/* Recent Invoices */}
                                <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-black">Recent Invoices</h3>
                                        <button onClick={() => setActiveMenu('Invoices')} className="text-xs text-gray-400 hover:text-black transition font-medium">View all →</button>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3 text-left">Invoice</th>
                                                <th className="px-6 py-3 text-left">Client</th>
                                                <th className="px-6 py-3 text-left">Date</th>
                                                <th className="px-6 py-3 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashRecentInvoices.map(inv => (
                                                <tr key={inv.id} className="border-t border-gray-50 hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                                                    <td className="px-6 py-3 font-medium text-black">{inv.id}</td>
                                                    <td className="px-6 py-3 text-gray-600">{inv.name}</td>
                                                    <td className="px-6 py-3 text-gray-400 text-xs">{inv.date}</td>
                                                    <td className="px-6 py-3 text-right font-semibold text-black">{inv.amount}</td>
                                                </tr>
                                            ))}
                                            {invoices.length === 0 && (
                                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No invoices yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Inventory Highlights */}
                                <div className="lg:col-span-2 flex flex-col gap-4">

                                    {/* Low Stock Alerts */}
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-black">Low Stock Alerts</h3>
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500">{dashLowStock.length} item{dashLowStock.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        {dashLowStock.length === 0 ? (
                                            <p className="text-xs text-gray-400">All items are sufficiently stocked. ✓</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {dashLowStock.slice(0, 4).map(item => (
                                                    <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{item.name}</p>
                                                            <p className="text-xs text-gray-400">{item.id}</p>
                                                        </div>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                            item.onHand <= 5 ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-500'
                                                        }`}>{item.onHand} left</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Inventory Stats */}
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                                        <h3 className="text-sm font-semibold text-black">Inventory Snapshot</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                                <p className="text-xl font-bold text-black">{inventory.length}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Products</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                                <p className="text-xl font-bold text-black">{dashTotalOnHand}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">On Hand</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                                <p className="text-xl font-bold text-black">{dashTotalUnitsSold}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Sold</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                                <p className="text-xl font-bold text-black">{dashLowStock.length}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Low Stock</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveMenu('Inventory')} className="text-xs text-center text-gray-400 hover:text-black transition font-medium mt-1">Manage inventory →</button>
                                    </div>

                                </div>
                            </div>

                            {/* ── Stock Level Bar Chart ── */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-sm font-semibold text-black">Stock Levels — Top Products</h3>
                                    <p className="text-xs text-gray-400">by units on hand</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {dashTopProducts.map(item => {
                                        const pct = Math.round((item.onHand / dashMaxOnHand) * 100);
                                        return (
                                            <div key={item.id}>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-400">{item.category} · {item.id}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-black">{item.onHand} units</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {inventory.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No inventory items yet.</p>}
                                </div>
                            </div>

                        </div>

                    ) : activeMenu === 'Invoices' ? (

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">

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
                                        value={invoiceSearch}
                                        onChange={(e) => setInvoiceSearch(e.target.value)}
                                    />
                                </div>

                                {userRole !== 'cashier' && (
                                    <button
                                        onClick={() => { 
                                            setIsEditing(false); 
                                            setEditingInvoiceId(null); 
                                            const nextId = 10471 + invoices.length;
                                            setInvoiceForm({ 
                                                customerName: '', 
                                                shippingAddress: '',
                                                contact: '',
                                                tin: '',
                                                poNumber: `PO-${nextId}`,
                                                cashier: '',
                                                salesPerson: '',
                                                date: new Date().toISOString().split('T')[0], 
                                                terms: 'Cash', 
                                                installmentDuration: '' 
                                            }); 
                                            setLineItems([{ code: '', description: '', unitCost: '', qty: 1 }]); 
                                            setIsCreateModalOpen(true); 
                                        }}
                                        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm"
                                    >
                                        + Create Invoice
                                    </button>
                                )}
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
                                            <th className="px-6 py-4">Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredInvoicesList.map((invoice) => (

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

                                                        {userRole !== 'cashier' && (
                                                            <>
                                                                {/* Edit */}
                                                                <button
                                                                    onClick={() => handleEditInvoice(invoice)}
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    Edit
                                                                </button>

                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => handleDeleteInvoice(invoice.id)}
                                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}

                                                    </div>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    ) : activeMenu === 'Inventory' ? (
                        <Inventory inventory={inventory} setInventory={setInventory} />
                    ) : activeMenu === 'Reports' ? (
                        <Reports inventory={inventory} invoices={invoices} />
                    ) : null}

                </div>

            </main>

            {/* Modal */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-[100] flex justify-center items-start p-4 md:p-12 overflow-y-auto bg-black/70 backdrop-blur-sm">
                    <div className="absolute inset-0 z-0" onClick={() => setSelectedInvoice(null)}></div>
                    
                    {/* The "Paper" Modal */}
                    <div className="bg-white shadow-2xl w-full max-w-[850px] relative z-10 rounded-sm transform origin-top flex flex-col mb-12">
                        {/* Internal Toolbar (Sticky) */}
                        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between z-20 print:hidden">
                            <div className="flex items-center gap-2">
                                <span className="bg-black text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Invoice</span>
                                <span className="text-sm font-semibold text-gray-400">{selectedInvoice.id}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Receipt
                                </button>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Paper Content */}
                        <div className="print:p-0">
                            <Invoice data={selectedInvoice} />
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
                            <h3 className="text-xl font-semibold text-black">{isEditing ? 'Edit Invoice' : 'Create New Invoice'}</h3>
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
                            <form id="create-invoice-form" className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleCreateInvoice(); }}>

                                {/* Header Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice No.</label>
                                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition bg-gray-50 text-gray-500 font-medium" value={isEditing ? editingInvoiceId : `#${10471 + invoices.length}`} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                                        <input type="date" value={invoiceForm.date} onChange={(e) => setInvoiceForm({...invoiceForm, date: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" required />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Customer Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sold To <span className="text-red-500">*</span></label>
                                            <input type="text" value={invoiceForm.customerName} onChange={(e) => setInvoiceForm({...invoiceForm, customerName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Kiana Cirilo" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Shipping Address <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.shippingAddress}
                                                onChange={(e) => setInvoiceForm({...invoiceForm, shippingAddress: e.target.value})}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" 
                                                placeholder="e.g. Metro Manila" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.contact}
                                                onChange={(e) => setInvoiceForm({...invoiceForm, contact: e.target.value})}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" 
                                                placeholder="e.g. 0917-123-4567" 
                                                pattern="[\d\+\-\s]+" 
                                                title="Please enter a valid contact number (digits, plus, dashes, spaces allowed)" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">TIN (Optional)</label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.tin}
                                                onChange={(e) => setInvoiceForm({...invoiceForm, tin: e.target.value})}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" 
                                                placeholder="000-000-000-000" 
                                                pattern="\d{3}-\d{3}-\d{3}-\d{3}" 
                                                title="Format: 000-000-000-000" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">Sales Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">PO Number</label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.poNumber}
                                                readOnly
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-0 outline-none transition bg-gray-50 text-gray-500 font-medium cursor-not-allowed" 
                                                placeholder="PO-" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Terms</label>
                                            <input type="text" value="Cash" readOnly className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 font-medium cursor-not-allowed outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cashier <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.cashier}
                                                onChange={(e) => setInvoiceForm({...invoiceForm, cashier: e.target.value})}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" 
                                                placeholder="e.g. SMADRID" 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sales Person <span className="text-red-500">*</span></label>
                                            <input 
                                                type="text" 
                                                value={invoiceForm.salesPerson}
                                                onChange={(e) => setInvoiceForm({...invoiceForm, salesPerson: e.target.value})}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition" 
                                                placeholder="e.g. ANTORRES" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Line Items</h4>
                                        <button type="button" onClick={handleAddLineItem} className="text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">+ Add Item</button>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-inner">
                                        <div className="grid grid-cols-12 gap-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                                            <div className="col-span-3">Product Code</div>
                                            <div className="col-span-4">Description</div>
                                            <div className="col-span-2">Unit Cost</div>
                                            <div className="col-span-1 text-center">Qty</div>
                                            <div className="col-span-2 text-right">Total</div>
                                        </div>
                                        
                                        {lineItems.map((item, index) => (
                                            <div key={index} className="flex flex-col mb-3">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-3">
                                                        <input type="text" value={item.code} readOnly placeholder="e.g. MWVV3AM/A" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50 text-gray-500 font-medium cursor-not-allowed" />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <select 
                                                            value={item.code} 
                                                            onChange={(e) => handleProductSelect(index, e.target.value)} 
                                                            className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-black outline-none bg-white transition ${item.stockError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`} 
                                                            required
                                                        >
                                                            <option value="" disabled>Select a product</option>
                                                            {inventory.map(prod => (
                                                                <option key={prod.id} value={prod.id}>{prod.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <input type="number" min="0" step="0.01" value={item.unitCost} readOnly placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-gray-50 text-gray-500 font-medium cursor-not-allowed" required />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <input 
                                                            type="number" 
                                                            min="1" 
                                                            value={item.qty} 
                                                            onChange={(e) => handleLineItemChange(index, 'qty', e.target.value)} 
                                                            className={`w-full border rounded-xl px-2 py-2.5 text-sm focus:ring-1 outline-none text-center bg-white transition ${item.stockError ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'}`} 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <input type="text" value={`PHP ${((parseFloat(item.unitCost || 0) * parseInt(item.qty || 0))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} readOnly className="w-full border-none bg-transparent px-3 py-2 text-sm text-gray-800 font-semibold outline-none text-right" />
                                                    </div>
                                                </div>
                                                {item.stockError && (
                                                    <p className="text-[10px] text-red-500 mt-1 ml-[25%] font-medium">⚠️ {item.stockError}</p>
                                                )}
                                            </div>
                                        ))}

                                        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                                            <div className="text-right">
                                                <span className="text-sm text-gray-500 mr-4">Total Amount:</span>
                                                <span className="text-lg font-bold text-black">PHP {calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                                type="submit"
                                form="create-invoice-form"
                                className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:opacity-90 transition shadow-md"
                            >
                                {isEditing ? 'Update Invoice' : 'Generate Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}