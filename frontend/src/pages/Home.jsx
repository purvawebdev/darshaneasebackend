import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, Calendar, Loader2, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Home = () => {
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTemples();
    }, []);

    const fetchTemples = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:8000/api/temples');
            setTemples(response.data.data || []);
        } catch (err) {
            setError('Failed to load temples. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewSlots = (templeId) => {
        navigate(`/slots/${templeId}`);
    };

    return (
        <div className="min-h-screen bg-warm-cream">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 py-16 px-4 sm:px-6 lg:px-8">
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
                        <span className="text-5xl">🛕</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-secondary-dark mb-4">
                        DarshanEase
                    </h1>
                    <p className="text-xl md:text-2xl text-warm-brown/80 max-w-3xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <span>Book Your Divine Darshan Across Sacred Temples</span>
                        <Sparkles className="w-6 h-6 text-accent" />
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2 text-primary font-semibold">
                        <Calendar className="w-5 h-5" />
                        <span>Choose a temple and select your preferred time</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-secondary-dark mb-2">
                        Explore Sacred Temples
                    </h2>
                    <p className="text-warm-brown/70">
                        Select a temple to view available darshan slots
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <p className="text-warm-brown mt-4 font-medium">Loading temples...</p>
                    </div>
                ) : temples.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-primary/30">
                        <span className="text-6xl">🛕</span>
                        <p className="text-warm-brown mt-4 text-xl font-semibold">
                            No temples available
                        </p>
                        <p className="text-warm-brown/60 text-sm mt-2">
                            Please check back later
                        </p>
                    </div>
                ) : (
                    /* Temple Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {temples.map((temple) => (
                            <div
                                key={temple._id}
                                className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Temple Image */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                                    <img
                                        src={temple.image}
                                        alt={temple.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=300&fit=crop';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>

                                {/* Temple Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-secondary-dark mb-2 line-clamp-1">
                                        {temple.name}
                                    </h3>

                                    <div className="flex items-start gap-2 text-primary mb-3">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-medium line-clamp-1">
                                            {temple.location}
                                        </span>
                                    </div>

                                    <p className="text-warm-brown/80 text-sm mb-1">
                                        <strong>Deity:</strong> {temple.deity}
                                    </p>

                                    <p className="text-warm-brown/70 text-xs mb-4 line-clamp-2">
                                        {temple.description}
                                    </p>

                                    <div className="bg-warm-cream/50 rounded-xl p-3 mb-4">
                                        <p className="text-xs text-warm-brown/60 mb-1">Timings</p>
                                        <p className="text-sm font-semibold text-warm-brown">
                                            {temple.timings}
                                        </p>
                                    </div>

                                    {/* View Slots Button */}
                                    <button
                                        onClick={() => handleViewSlots(temple._id)}
                                        className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        View Available Slots
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {temples.length > 0 && (
                    <div className="text-center mt-12 pt-8 border-t border-warm-beige/50">
                        <p className="text-warm-brown/60 text-sm">
                            🙏 May your darshan bring peace and blessings 🙏
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
