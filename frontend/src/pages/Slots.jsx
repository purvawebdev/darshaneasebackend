import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, Loader2, CheckCircle2, XCircle, MapPin, Home, ChevronRight } from 'lucide-react';
import { slotsAPI, bookingsAPI, templesAPI } from '../services/api';

const Slots = () => {
    const { templeId } = useParams();
    const navigate = useNavigate();

    const [temple, setTemple] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [templeLoading, setTempleLoading] = useState(true);
    const [bookingSlot, setBookingSlot] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        if (templeId) {
            fetchTemple();
            fetchSlots();
        }
    }, [templeId, selectedDate]);

    const fetchTemple = async () => {
        setTempleLoading(true);
        try {
            const response = await templesAPI.getTempleById(templeId);
            setTemple(response.data.data);
        } catch (err) {
            setError('Temple not found');
        } finally {
            setTempleLoading(false);
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await slotsAPI.getSlots(templeId, selectedDate);
            setSlots(response.data.data || []);
        } catch (err) {
            setError('Failed to load slots. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (slotId) => {
        setBookingSlot(slotId);
        setError('');
        setSuccess('');

        try {
            await bookingsAPI.createBooking(slotId);
            setSuccess('🙏 Booking confirmed! May your darshan be blessed.');
            setTimeout(() => setSuccess(''), 5000);
            fetchSlots(); // Refresh to update capacity
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBookingSlot(null);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (!templeId) {
        navigate('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-warm-cream py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-warm-brown/70 mb-6">
                    <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-warm-brown font-medium">
                        {temple?.name || 'Loading...'}
                    </span>
                </nav>

                {/* Temple Banner */}
                {templeLoading ? (
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8 mb-8 animate-pulse">
                        <div className="h-8 bg-warm-beige rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-warm-beige rounded w-1/2"></div>
                    </div>
                ) : temple && (
                    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8 mb-8">
                        <div className="flex items-center gap-6">
                            {/* Temple Image */}
                            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                <img
                                    src={temple.image}
                                    alt={temple.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop';
                                    }}
                                />
                            </div>

                            {/* Temple Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-extrabold text-secondary-dark mb-2">
                                    {temple.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-warm-brown">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="font-medium">{temple.location}</span>
                                    </div>
                                    <div className="text-sm">
                                        <strong>Deity:</strong> {temple.deity}
                                    </div>
                                    <div className="text-sm">
                                        <strong>Timings:</strong> {temple.timings}
                                    </div>
                                </div>
                                <p className="text-warm-brown/80 mt-2 text-sm">
                                    {temple.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-secondary-dark mb-2 flex items-center justify-center gap-3">
                        <span className="text-4xl">🕐</span>
                        Available Darshan Slots
                    </h2>
                    <p className="text-warm-brown/70 text-lg">Choose your preferred time for divine blessings</p>
                </div>

                {/* Date Filter Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2 text-warm-brown font-semibold">
                            <Calendar className="h-5 w-5 text-primary" />
                            Filter by Date
                        </div>
                        <div className="flex-1 flex items-center gap-3">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-warm-beige focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all bg-white/80 text-warm-brown"
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate('')}
                                    className="px-4 py-2.5 text-sm font-semibold text-primary hover:text-primary-dark bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 animate-shake">
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <p className="text-warm-brown mt-4 font-medium">Loading sacred timings...</p>
                    </div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50">
                        <span className="text-6xl">🛕</span>
                        <p className="text-warm-brown mt-4 text-xl font-semibold">No slots available</p>
                        <p className="text-warm-brown/60 text-sm mt-2">
                            {selectedDate ? 'Try selecting a different date' : 'Please check back later'}
                        </p>
                    </div>
                ) : (
                    /* Slots Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slots.map((slot) => {
                            const isFull = slot.currentBooked >= slot.maxCapacity;
                            const spotsLeft = slot.maxCapacity - slot.currentBooked;
                            const percentFilled = (slot.currentBooked / slot.maxCapacity) * 100;

                            return (
                                <div
                                    key={slot._id}
                                    className={`bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border transition-all duration-300 hover:shadow-2xl ${isFull
                                        ? 'border-gray-300 opacity-75'
                                        : 'border-white/50 hover:border-primary/30'
                                        }`}
                                >
                                    <div className="p-6">
                                        {/* Date Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(slot.date)}
                                            </span>
                                            {isFull && (
                                                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200">
                                                    FULL
                                                </span>
                                            )}
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="p-2.5 bg-primary/10 rounded-xl">
                                                <Clock className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-warm-brown/60 font-medium">Darshan Time</p>
                                                <p className="text-xl font-bold text-secondary-dark">
                                                    {slot.startTime} - {slot.endTime}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Capacity */}
                                        <div className="bg-warm-cream/50 rounded-2xl p-4 mb-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-warm-brown font-semibold text-sm">
                                                    <Users className="h-4 w-4 text-primary" />
                                                    Capacity
                                                </div>
                                                <span className={`text-sm font-bold ${spotsLeft <= 5 && !isFull ? 'text-red-600' : 'text-warm-brown'
                                                    }`}>
                                                    {slot.currentBooked} / {slot.maxCapacity}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isFull
                                                        ? 'bg-gray-400'
                                                        : spotsLeft <= 5
                                                            ? 'bg-gradient-to-r from-red-500 to-red-600'
                                                            : 'bg-gradient-to-r from-primary to-accent'
                                                        }`}
                                                    style={{ width: `${percentFilled}%` }}
                                                />
                                            </div>

                                            {!isFull && spotsLeft <= 10 && (
                                                <p className="text-xs text-red-600 mt-2 font-semibold">
                                                    ⚠️ Only {spotsLeft} spots left!
                                                </p>
                                            )}
                                        </div>

                                        {/* Book Button */}
                                        <button
                                            onClick={() => handleBook(slot._id)}
                                            disabled={isFull || bookingSlot === slot._id}
                                            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${isFull
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                : bookingSlot === slot._id
                                                    ? 'bg-primary/50 text-white cursor-wait'
                                                    : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                                                }`}
                                        >
                                            {bookingSlot === slot._id ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                    Booking...
                                                </span>
                                            ) : isFull ? (
                                                'Fully Booked'
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    🙏 Book Darshan
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slots;
