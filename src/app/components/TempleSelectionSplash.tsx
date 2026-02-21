import { motion } from "motion/react";

export function TempleSelectionSplash() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-800">
      {/* Animated gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-teal-500/20"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6 opacity-60"
        >
          <img src="/logesh.png" 
            alt="DarshanEase Logo"
            className="w-20 h-20 object-contain"
          />
        </motion.div>

        {/* Text */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight"
        >
          Select Your Temple
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
          className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 mx-auto rounded-full"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 text-cyan-100 text-lg font-light tracking-widest uppercase"
        >
          Beginning your spiritual journey...
        </motion.p>
      </div>

      {/* Decorative floating elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 - 50 + "%", 
            y: "110%", 
            opacity: 0 
          }}
          animate={{ 
            y: "-10%", 
            opacity: [0, 0.2, 0] 
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className="absolute w-1 h-1 bg-cyan-200 rounded-full blur-sm"
        />
      ))}
    </div>
  );
}
