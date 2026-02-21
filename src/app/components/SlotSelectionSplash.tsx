import { motion } from "motion/react";

export function SlotSelectionSplash() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-800 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <img src="/logesh.png" alt="Logo" className="w-24 h-24 object-contain opacity-50" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center px-6"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Looking for available slots...
        </h2>
        
        {/* Divine loading indicator */}
        <div className="relative w-48 h-1 bg-white/10 mx-auto rounded-full overflow-hidden">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
          />
        </div>
        
        <p className="mt-8 text-cyan-200/60 text-sm tracking-widest uppercase animate-pulse">
          Checking temple availability
        </p>
      </motion.div>
    </div>
  );
}
