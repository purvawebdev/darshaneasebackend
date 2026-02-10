import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

const Register = () => {
    const { register, loading, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already logged in
    if (isAuthenticated) {
        return <Navigate to="/slots" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !phone || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const result = await register(name, phone, password);
        if (!result.success) {
            setError(result.message);
        }
    };
    return (
        <div className="min-h-screen bg-warm-cream flex items-center justify-center px-4 py-12 relative overflow-hidden">

            {/* --- Modern Animated Background --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md z-10">

                {/* --- Header Section --- */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-3xl shadow-lg transform rotate-3 mb-4 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl filter drop-shadow-md">🛕</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-secondary-dark tracking-tight">DarshanEase</h1>
                    <p className="text-warm-brown/80 mt-2 font-medium flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Join our blessed community
                        <Sparkles className="w-4 h-4 text-accent" />
                    </p>
                </div>

                {/* --- Glassmorphism Card --- */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">

                    <h2 className="text-2xl font-bold text-center text-warm-brown mb-6">
                        Create Account
                    </h2>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-warm-brown ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-warm-brown/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-warm-beige rounded-xl leading-5 bg-white/50 placeholder-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 sm:text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-warm-brown ml-1">Phone Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-warm-brown/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-warm-beige rounded-xl leading-5 bg-white/50 placeholder-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 sm:text-sm"
                                    placeholder="Enter 10-digit number"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-warm-brown ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-warm-brown/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-warm-beige rounded-xl leading-5 bg-white/50 placeholder-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 sm:text-sm"
                                    placeholder="Create a strong password"
                                />
                                {/* Show/Hide Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ?
                                        <EyeOff className="h-5 w-5 text-warm-brown/40 hover:text-primary cursor-pointer transition-colors" /> :
                                        <Eye className="h-5 w-5 text-warm-brown/40 hover:text-primary cursor-pointer transition-colors" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-warm-brown ml-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-warm-brown/40 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-warm-beige rounded-xl leading-5 bg-white/50 placeholder-warm-brown/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 sm:text-sm"
                                    placeholder="Repeat your password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-warm-brown/70 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-primary-dark hover:underline transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-warm-brown/50 mt-8 text-xs font-medium uppercase tracking-widest">
                    🙏 May your darshan be blessed 🙏
                </p>
            </div>
        </div>
    );
};


export default Register;
