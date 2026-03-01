import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Package, Truck, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../api/axios';

interface DashboardData {
    totalRevenue: number;
    todayRevenue: number;
    monthlyRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    dailyRevenueLast7Days: { _id: string; total: number }[];
    topItems: { _id: string; totalQuantity: number }[];
}

const Dashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center">Loading...</div>;
    if (!data) return <div className="text-red-500">Failed to load analytics</div>;

    const statCards = [
        { name: 'Total Revenue', value: `$${data.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { name: 'Today\'s Revenue', value: `$${data.todayRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Total Orders', value: data.totalOrders, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Pending', value: data.pendingOrders, icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { name: 'Ready', value: data.readyOrders, icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {statCards.map((item) => (
                    <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-100">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 p-3 rounded-md ${item.bg}`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                                    <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue (Last 7 Days)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.dailyRevenueLast7Days} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="_id" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="totalQuantity" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
