import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Inventory({ inventory = [], setInventory }) {
    const [activeTab, setActiveTab] = useState('on-hand');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [itemForm, setItemForm] = useState({
        id: '', name: '', category: '', price: '', onHand: 0, sold: 0
    });

    const openAddModal = () => {
        setIsEditing(false);
        setEditingItemId(null);
        setItemForm({ id: '', name: '', category: '', price: '', onHand: 0, sold: 0 });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setIsEditing(true);
        setEditingItemId(item.id);
        const rawPrice = parseFloat(item.price.replace(/PHP\s|,/g, ''));
        setItemForm({
            id: item.id,
            name: item.name,
            category: item.category,
            price: rawPrice,
            onHand: item.onHand,
            sold: item.sold,
        });
        setIsModalOpen(true);
    };

    const handleDeleteItem = (id) => {
        if (window.confirm(`Are you sure you want to delete this item? This action cannot be undone.`)) {
            // Delete from database via Inertia DELETE request
            router.delete(route('inventory.destroy', id), {
                onError: (errors) => {
                    console.error(errors);
                    alert("An error occurred while deleting the product.");
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const priceStr = `PHP ${parseFloat(itemForm.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        if (isEditing && editingItemId) {
            // Save updates to database via Inertia PUT request
            router.put(route('inventory.update', editingItemId), itemForm, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setIsEditing(false);
                    setEditingItemId(null);
                    setItemForm({ id: '', name: '', category: '', price: '', onHand: 0, sold: 0 });
                },
                onError: (errors) => {
                    if (errors.id) {
                        alert(errors.id); // Show validation error
                    } else {
                        console.error(errors);
                        alert("An error occurred while updating the product.");
                    }
                }
            });
        } else {
            // Save to database via Inertia POST request
            router.post(route('inventory.store'), itemForm, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setItemForm({ id: '', name: '', category: '', price: '', onHand: 0, sold: 0 });
                },
                onError: (errors) => {
                    if (errors.id) {
                        alert(errors.id); // Show validation error for duplicate product code
                    } else {
                        console.error(errors);
                        alert("An error occurred while saving the product.");
                    }
                }
            });
        }
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const totalSold = inventory.reduce((acc, item) => acc + item.sold, 0);
    const totalOnHand = inventory.reduce((acc, item) => acc + item.onHand, 0);
    const totalValue = inventory.reduce((acc, item) => {
        const numericPrice = parseFloat(item.price.replace(/PHP\s|,/g, ''));
        return acc + (numericPrice * item.onHand);
    }, 0);

    const formattedTotalValue = 'PHP ' + totalValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total Products Sold</p>
                    <h2 className="text-3xl font-semibold text-black">{totalSold}</h2>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total On Hand</p>
                    <h2 className="text-3xl font-semibold text-black">{totalOnHand}</h2>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-2">Total Inventory Value</p>
                    <h2 className="text-3xl font-semibold text-black">{formattedTotalValue}</h2>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('on-hand')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'on-hand' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            On-Hand
                        </button>
                        <button
                            onClick={() => setActiveTab('products-sold')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'products-sold' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Products Sold
                        </button>
                    </div>

                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search inventory"
                            className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:ring-1 focus:ring-black w-full sm:w-64 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {activeTab === 'on-hand' && (
                        <button
                            onClick={openAddModal}
                            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition sm:ml-auto"
                        >
                            + Add Product
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Product Code</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">{activeTab === 'on-hand' ? 'In Stock' : 'Units Sold'}</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                    <td className="px-6 py-5 font-medium text-black">{item.id}</td>
                                    <td className="px-6 py-5">
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-5 text-gray-500">{item.category}</td>
                                    <td className="px-6 py-5 text-gray-500">{item.price}</td>
                                    <td className="px-6 py-5 font-medium text-black">
                                        {activeTab === 'on-hand' ? item.onHand : item.sold}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {/* Edit */}
                                            {activeTab === 'on-hand' && (
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                            )}
                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 transform transition-all flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                            <h3 className="text-xl font-semibold text-black">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <form id="item-form" className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Code <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={itemForm.id}
                                        onChange={e => setItemForm({ ...itemForm, id: e.target.value })}
                                        className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none ${isEditing ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                                        readOnly={isEditing}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                                        <input type="text" value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit Price <span className="text-red-500">*</span></label>
                                        <input type="number" step="0.01" min="0" value={itemForm.price} onChange={e => setItemForm({ ...itemForm, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">In Stock <span className="text-red-500">*</span></label>
                                        <input type="number" min="0" value={itemForm.onHand} onChange={e => setItemForm({ ...itemForm, onHand: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Units Sold</label>
                                        <input type="number" min="0" value={itemForm.sold} onChange={e => setItemForm({ ...itemForm, sold: parseInt(e.target.value) || 0 })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-black outline-none" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3 rounded-b-3xl">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition">Cancel</button>
                            <button type="submit" form="item-form" className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:opacity-90 transition shadow-md">
                                {isEditing ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
