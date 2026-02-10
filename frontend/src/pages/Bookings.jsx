import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Loader2, Package } from 'lucide-react';
import { bookingsAPI } from '../services/api';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await bookingsAPI.getMyBookings();
            setBookings(response.data.data || []);
        } catch (err) {
            setError('Failed to load bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Date unavailable';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatBookingDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-warm-cream py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-secondary-dark mb-2 flex items-center justify-center gap-3">
                        <span className="text-4xl">📿</span>
                        My Darshan Bookings
                    </h1>
                    <p className="text-warm-brown/70 text-lg">Your confirmed divine appointments</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <p className="text-warm-brown mt-4 font-medium">Loading your bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-primary/30">
                        <div className="mb-4">
                            <Package className="w-20 h-20 text-primary/40 mx-auto" />
                        </div>
                        <p className="text-warm-brown mt-4 text-xl font-semibold">
                            No bookings yet
                        </p>
                        <p className="text-warm-brown/60 text-sm mt-2 mb-6">
                            Book your darshan slot to begin your spiritual journey
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            Browse Temples
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary/20 shadow-md">
                                <p className="text-4xl font-extrabold text-primary">{bookings.length}</p>
                                <p className="text-warm-brown text-sm font-medium mt-1">Total Bookings</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-50 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-200 shadow-md">
                                <div className="flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-warm-brown text-sm font-medium">All Confirmed</p>
                            </div>
                            <div className="bg-gradient-to-br from-accent/30 to-accent/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-accent/30 shadow-md">
                                <p className="text-4xl">🙏</p>
                                <p className="text-warm-brown text-sm font-medium mt-1">Blessed</p>
                            </div>
                        </div>

                        {/* Bookings List */}
                        <div className="space-y-4">
                            {bookings.map((booking, index) => (
                                <div
                                    key={booking.bookingId}
                                    className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Left - Icon & Main Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <span className="text-3xl">🛕</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-secondary-dark text-lg">
                                                        {booking.slot?.temple?.name || 'Temple Name'}
                                                    </h3>
                                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Confirmed
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    {booking.slot?.temple?.location && (
                                                        <div className="flex items-center gap-2 text-warm-brown/70 text-sm">
                                                            📍 {booking.slot.temple.location}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(booking.slot?.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-warm-brown">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{booking.slot?.time || 'Time unavailable'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right - Metadata */}
                                        <div className="flex flex-col items-start md:items-end gap-2 text-sm">
                                            <div className="text-warm-brown/60">
                                                <span className="font-medium">Booked on:</span>{' '}
                                                {formatBookingDate(booking.bookedAt)}
                                            </div>
                                            <div className="font-mono text-xs text-warm-brown/40 bg-warm-beige/50 px-3 py-1 rounded-lg">
                                                ID: {booking.bookingId?.slice(-12)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Capacity Info */}
                                    {booking.slot?.capacity && (
                                        <div className="mt-4 pt-4 border-t border-warm-beige/50">
                                            <p className="text-warm-brown/70 text-sm flex items-center gap-2">
                                                <span className="text-primary">👥</span>
                                                <span>Slot capacity: <strong>{booking.slot.capacity}</strong></span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-8">
                            <p className="text-warm-brown/60 text-sm">
                                🙏 May your darshan bring peace and blessings 🙏
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
