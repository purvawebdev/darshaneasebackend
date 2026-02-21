import { motion } from "motion/react";
import { CreditCard, ShieldCheck, ArrowRight, Wallet, Banknote } from "lucide-react";
import { BookingData } from "./SlotSelectionPage";
import { Button } from "./ui/button";

interface BookingConfirmationPageProps {
  bookingData: BookingData;
  onPay: () => void;
  onBack: () => void;
}

export function BookingConfirmationPage({ bookingData, onPay, onBack }: BookingConfirmationPageProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0f18] text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl rounded-[40px] border border-white/10 p-8 sm:p-12 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/20 mb-6 border border-teal-500/30">
            <CreditCard className="text-teal-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Review & Pay</h1>
          <p className="text-gray-400">Secure booking for your spiritual journey</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-gray-400">Temple</span>
              <span className="font-bold text-lg text-teal-400">{bookingData.temple.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Booking for</span>
              <span className="font-semibold">{bookingData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Slot & Date</span>
              <span className="font-semibold">{bookingData.slot} | {bookingData.date.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total People</span>
              <span className="font-semibold">{bookingData.adults + bookingData.children} (Adults: {bookingData.adults}, Children: {bookingData.children})</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-teal-400 font-bold uppercase text-xs tracking-widest mb-1">Total Payable</p>
                <h2 className="text-4xl font-black">₹{bookingData.totalAmount.toFixed(2)}</h2>
              </div>
              <ShieldCheck className="text-teal-400/50" size={48} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onBack}
            className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={onPay}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Pay Securely
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 text-xs uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <Wallet size={14} /> UPI
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={14} /> CARDS
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} /> ENCRYPTED
          </div>
        </div>
      </motion.div>
    </div>
  );
}
