import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Hash } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


const templeImages = [
  "https://images.unsplash.com/photo-1619239632374-9e6651c2b7bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmF2aWRpYW4lMjB0ZW1wbGUlMjBnb3B1cmFtJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MTA1MjczOHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1692173248120-59547c3d4653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGluZGlhbiUyMHRlbXBsZSUyMG1lZW5ha3NoaXxlbnwxfHx8fDE3NzEwNTI3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680165406639-4a9f17033374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW1pbCUyMG5hZHUlMjB0ZW1wbGUlMjB0b3dlcnxlbnwxfHx8fDE3NzEwNTI3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

export function LoginPage({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Auto-rotate background images every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % templeImages.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  const handleSendOtp = () => {
    if (phoneNumber.length === 10) {
      setOtpSent(true);
      console.log("OTP sent to:", phoneNumber);
      // Handle OTP sending logic here
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { phoneNumber, otp });
    // Handle login logic here
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={templeImages[currentImageIndex]}
              alt="Temple background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center justify-center mb-4"
              >
                <img src="/logesh.png" alt="Logo" 
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
              <p className="text-gray-300 text-sm">
                Serving to make your Darshan experience elite!
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/50 h-12"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">
                  OTP
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP sent to your mobile"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-11 pr-24 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/50 h-12"
                    maxLength={6}
                    required
                  />
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={phoneNumber.length !== 10}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-teal-400 hover:text-teal-300 transition-colors bg-teal-500/20 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                    >
                      Resend
                    </button>
                  )}
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Need Help?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white h-12 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Don't have an account?{" "}
                <button className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                  Register Now
                </button>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-400">
              Secure login powered by DarshanEase
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}