import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto w-full">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
