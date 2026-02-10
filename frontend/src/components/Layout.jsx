import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Temple-themed Navbar
const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-primary via-primary-dark to-primary shadow-xl sticky top-0 z-50 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                            <span className="text-2xl">🛕</span>
                        </div>
                        <span className="text-white text-xl font-extrabold tracking-tight">
                            DarshanEase
                        </span>
                    </a>

                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="/"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${isActive('/')
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Home className="h-4 w-4" />
                                Temples
                            </a>
                            <a
                                href="/bookings"
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${isActive('/bookings')
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Package className="h-4 w-4" />
                                My Bookings
                            </a>
                        </div>
                    )}

                    {/* User Info & Logout */}
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-3">
                            <span className="text-white/90 text-sm font-medium hidden sm:block bg-white/10 px-4 py-2 rounded-xl">
                                🙏 {user.name || 'Devotee'}
                            </span>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg backdrop-blur-sm"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            {isAuthenticated && (
                <div className="md:hidden border-t border-white/10 px-4 py-3 flex gap-2">
                    <a
                        href="/"
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/')
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                    >
                        <Home className="h-4 w-4" />
                        Temples
                    </a>
                    <a
                        href="/bookings"
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/bookings')
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10'
                            }`}
                    >
                        <Package className="h-4 w-4" />
                        Bookings
                    </a>
                </div>
            )}
        </nav>
    );
};

// Layout wrapper for authenticated pages
const Layout = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-warm-cream">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
