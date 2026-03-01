import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

interface OrderItem {
    _id?: string;
    name: string;
    quantity: number;
    price: number;
}

interface OrderFormProps {
    order?: any | null;
    onClose: () => void;
    onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onClose, onSuccess }) => {
    const [customerName, setCustomerName] = useState(order?.customerName || '');
    const [mobileNumber, setMobileNumber] = useState(order?.mobileNumber || '');
    const [items, setItems] = useState<OrderItem[]>(
        order?.items || [{ name: '', quantity: 1, price: 0 }]
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateTotal = () => {
        return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    };

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                customerName,
                mobileNumber,
                items,
                totalAmount: calculateTotal(),
            };

            if (order?._id) {
                await api.put(`/orders/${order._id}`, payload);
            } else {
                await api.post('/orders', payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {order ? 'Edit Order' : 'New Order'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        required
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        required
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Items</h3>
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-md">
                                        <div className="w-full sm:flex-1">
                                            <label className="block sm:hidden text-xs text-gray-500 mb-1">Item Name</label>
                                            <input
                                                type="text"
                                                placeholder="Item name"
                                                required
                                                className="block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex w-full sm:w-auto gap-4">
                                            <div className="w-1/2 sm:w-24">
                                                <label className="block sm:hidden text-xs text-gray-500 mb-1">Qty</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    placeholder="Qty"
                                                    className="block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-1/2 sm:w-32">
                                                <label className="block sm:hidden text-xs text-gray-500 mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                    placeholder="Price"
                                                    className="block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700 p-2 border border-red-200 sm:border-transparent rounded-md flex justify-center items-center w-full sm:w-auto"
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                                <span className="sm:hidden ml-2">Remove Item</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 text-right pr-4">
                                <span className="text-sm font-medium text-gray-700">Total: </span>
                                <span className="text-lg font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {error && <div className="text-red-600 text-sm">{error}</div>}
                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="order-form"
                        disabled={loading}
                        className="inline-flex justify-center flex-shrink-0 disabled:opacity-50 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? 'Saving...' : 'Save Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
