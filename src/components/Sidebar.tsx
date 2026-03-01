import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, Store } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Orders', path: '/orders', icon: ShoppingBag },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center justify-center h-20 border-b border-gray-200">
                <Store className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">OMS</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <item.icon
                                className="mr-3 flex-shrink-0 h-6 w-6"
                                aria-hidden="true"
                            />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex flex-row items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                    <LogOut className="mr-3 h-6 w-6" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
