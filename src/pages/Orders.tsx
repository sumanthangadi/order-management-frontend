import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import OrderForm from '../components/OrderForm';

const Orders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.delete(`/orders/${id}`);
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.mobileNumber.includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                <button
                    onClick={() => { setSelectedOrder(null); setIsFormOpen(true); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add Order
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6 border border-gray-100 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-shrink-0 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID / Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items ($Total)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-mono text-xs text-gray-500 mb-1">{order._id.substring(order._id.length - 6)}</div>
                                            <div>{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-sm text-gray-500">{order.mobileNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">{order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}</div>
                                            <div className="text-sm font-medium text-green-600 mt-1">${order.totalAmount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-medium rounded-full px-2 py-1 outline-none appearance-none cursor-pointer border-0 ring-1 ring-inset ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                        order.status === 'ready' ? 'bg-blue-50 text-blue-800 ring-blue-600/20' :
                                                            'bg-green-50 text-green-800 ring-green-600/20'
                                                    }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => { setSelectedOrder(order); setIsFormOpen(true); }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <Edit className="h-5 w-5 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                            No orders found matching the criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <OrderForm
                    order={selectedOrder}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
};

export default Orders;
