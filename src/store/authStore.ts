import { create } from 'zustand';

interface AuthState {
    token: string | null;
    admin: { _id: string; email: string } | null;
    setAuth: (token: string, admin: { _id: string; email: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')!) : null,
    setAuth: (token, admin) => {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        set({ token, admin });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        set({ token: null, admin: null });
    },
}));
