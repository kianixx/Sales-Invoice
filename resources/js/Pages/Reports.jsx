import { useState } from 'react';

export default function Reports({ inventory = [], invoices = [] }) {
    const [filterType, setFilterType] = useState('All');
    const [dateFilter, setDateFilter] = useState('');

    // Define dynamic reports based on live data
    const reportsList = [
        { 
            id: 'REP-SALES', 
            type: 'Sales Summary', 
            date: new Date().toISOString().split('T')[0], 
            generatedBy: 'System', 
            size: `${(invoices.length * 0.5).toFixed(1)} KB`,
            data: invoices
        },
        { 
            id: 'REP-INV', 
            type: 'Inventory Status', 
            date: new Date().toISOString().split('T')[0], 
            generatedBy: 'System', 
            size: `${(inventory.length * 0.3).toFixed(1)} KB`,
            data: inventory
        },
        { 
            id: 'REP-LOW', 
            type: 'Low Stock Alert', 
            date: new Date().toISOString().split('T')[0], 
            generatedBy: 'System', 
            size: '2 KB',
            data: inventory.filter(item => item.onHand <= 5)
        },
    ];

    const filteredReports = reportsList.filter(report => {
        const matchesType = filterType === 'All' || report.type === filterType;
        const matchesDate = !dateFilter || report.date === dateFilter;
        return matchesType && matchesDate;
    });

    const handleDownloadCSV = (report) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        if (report.type === 'Sales Summary') {
            const headers = ["Invoice ID", "Customer", "Date", "Amount", "Status"];
            csvContent += headers.join(",") + "\n";
            report.data.forEach(inv => {
                const row = [inv.id, `"${inv.name}"`, inv.date, `"${inv.amount}"`, inv.status];
                csvContent += row.join(",") + "\n";
            });
        } else if (report.type === 'Inventory Status') {
            const headers = ["Product Code", "Name", "Category", "Price", "On Hand", "Sold"];
            csvContent += headers.join(",") + "\n";
            report.data.forEach(item => {
                const row = [item.id, `"${item.name}"`, item.category, `"${item.price}"`, item.onHand, item.sold];
                csvContent += row.join(",") + "\n";
            });
        } else if (report.type === 'Low Stock Alert') {
            const headers = ["Product Code", "Name", "On Hand"];
            csvContent += headers.join(",") + "\n";
            report.data.forEach(item => {
                const row = [item.id, `"${item.name}"`, item.onHand];
                csvContent += row.join(",") + "\n";
            });
        }
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${report.type.replace(/\s+/g, '_').toLowerCase()}_${report.date}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide">Report Category</label>
                        <select 
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-black outline-none bg-white min-w-[160px]"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Sales Summary">Sales Summary</option>
                            <option value="Inventory Status">Inventory Status</option>
                            <option value="Low Stock Alert">Low Stock Alert</option>
                        </select>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Live Statistics</span>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Invoices</p>
                            <p className="text-sm font-bold text-black">{invoices.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Products</p>
                            <p className="text-sm font-bold text-black">{inventory.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                        <tr>
                            <th className="px-6 py-4">Report ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4">Est. Size</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => (
                            <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                <td className="px-6 py-5 font-medium text-black">{report.id}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{report.type}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">Generated by {report.generatedBy}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-gray-500">{report.date}</td>
                                <td className="px-6 py-5 text-gray-500">{report.size}</td>
                                <td className="px-6 py-5 text-right">
                                    <button 
                                        onClick={() => handleDownloadCSV(report)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 text-xs font-bold transition shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Export CSV
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

