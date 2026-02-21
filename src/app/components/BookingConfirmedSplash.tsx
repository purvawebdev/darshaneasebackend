import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function BookingConfirmedSplash() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-800 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="mb-8 bg-white/20 p-8 rounded-full backdrop-blur-xl border border-white/30"
      >
        <CheckCircle2 className="w-24 h-24 text-teal-300" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-4xl sm:text-5xl font-bold text-white text-center px-4"
      >
        Your booking is confirmed!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="mt-6 text-cyan-100 text-lg font-light tracking-wide animate-pulse"
      >
        Generating your digital Darshan pass...
      </motion.p>
    </div>
  );
}
