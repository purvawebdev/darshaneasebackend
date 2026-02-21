import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";


const temples = [
  {
    id: 1,
    name: "Shirdi Saibaba Temple",
    location: "Shirdi, Maharashtra",
    image: "Shirdideity.jpg",
    description: "The abode of Shri Sai Baba, a place of universal peace."
  },
  {
    id: 2,
    name: "Tirupati Balaji Temple",
    location: "Tirumala, Andhra Pradesh",
    image: "govinda.jpg",
    description: "One of the richest and most visited religious sites in the world."
  },
  {
    id: 3,
    name: "Mahalaxmi Temple",
    location: "Kolhapur, Maharashtra",
    image: "Mahalaxmi.jpg",
    description: "An ancient temple dedicated to Goddess Ambabai."
  },
  {
    id: 4,
    name: "Shri Vitthal Rukmini Temple",
    location: "Pandharpur, Maharashtra",
    image: "vitthal.jpg",
    description: "The spiritual heart of Maharashtra, dedicated to Lord Vitthal."
  },
  {
    id: 5,
    name: "Shri Tulja Bhavani Mandir",
    location: "Tuljapur, Maharashtra",
    image:"tuljabhavani.jpg",
    description: "Dedicated to the family deity of the Bhosale clan."
  }
];

const backgroundVideos = [
  "https://images.unsplash.com/photo-1767533427544-5f88d3fe4eed?auto=format&fit=crop&q=80&w=1920", // Temple evening
  "https://images.unsplash.com/photo-1608973557237-4ab537f2cd5a?auto=format&fit=crop&q=80&w=1920", // Ancient architecture
  "https://images.unsplash.com/photo-1608485182386-8cdc8d59f453?auto=format&fit=crop&q=80&w=1920", // Spiritual lamp
];

interface TempleSelectionPageProps {
  onSelectTemple: (id: number) => void;
}

export function TempleSelectionPage({ onSelectTemple }: TempleSelectionPageProps) {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundVideos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={backgroundVideos[bgIndex]}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/80 via-transparent to-slate-950" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <header className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400"
          >
            DarshanEase
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3 }}
            className="text-cyan-100 text-lg"
          >
            Choose your destination for divine Darshan
          </motion.p>
        </header>

        {/* Temple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {temples.map((temple, index) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 glass-morphism cursor-pointer"
            >
              {/* Temple Image */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="h-full w-full"
                >
                  <img
                    src={temple.image}
                    alt={temple.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Temple Info */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                    <MapPin className="size-4" />
                    <span className="font-medium tracking-wide uppercase">
                      {temple.location}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    {temple.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {temple.description}
                  </p>
                  
                  <button 
                    onClick={() => onSelectTemple(temple.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold transition-all group-hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                  >
                    Book Darshan
                    <ChevronRight className="size-4" />
                  </button>
                </motion.div>
              </div>

              {/* Overlay for inactive state (optional) */}
              <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2026 DarshanEase. Smart Darshan, Less Waiting!</p>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-morphism {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}} />
    </div>
  );
}
