import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { CreditCard, Smartphone, Building2, ChevronRight, QrCode, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "./ui/button";

interface PaymentPageProps {
  bookingData: any;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function PaymentPage({ bookingData, onPaymentSuccess, onBack }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  const upiId = "darshanease@upi";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="size-6 text-teal-400" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold">Secure Payment</h2>
            <p className="text-teal-400 text-sm">Booking for {bookingData.name}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="p-8 space-y-8">
          {/* Amount Box */}
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6 text-center">
            <p className="text-teal-200/60 text-xs uppercase tracking-widest mb-1">Total Amount Payable</p>
            <h3 className="text-4xl font-black text-white">₹{bookingData.totalAmount}.00</h3>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider px-2">Select Payment Method</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {/* UPI Option */}
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  paymentMethod === "upi" ? "bg-teal-500/20 border-teal-500 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Smartphone className="size-6 text-teal-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">UPI / GPay / PhonePe</p>
                  <p className="text-xs text-white/40">Pay via any UPI app</p>
                </div>
                {paymentMethod === "upi" && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
              </button>

              {/* Net Banking */}
              <button
                onClick={() => setPaymentMethod("netbanking")}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  paymentMethod === "netbanking" ? "bg-teal-500/20 border-teal-500 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <Building2 className="size-6 text-teal-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Net Banking</p>
                  <p className="text-xs text-white/40">All major Indian banks supported</p>
                </div>
                {paymentMethod === "netbanking" && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
              </button>

              {/* QR Code */}
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  paymentMethod === "qr" ? "bg-teal-500/20 border-teal-500 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <QrCode className="size-6 text-teal-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Scan QR Code</p>
                  <p className="text-xs text-white/40">Display dynamic QR for instant payment</p>
                </div>
                {paymentMethod === "qr" && <div className="w-3 h-3 bg-teal-500 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Dynamic Content based on selection */}
          <AnimatePresence mode="wait">
            {paymentMethod === "qr" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-4 bg-white p-6 rounded-3xl"
              >
                <div className="bg-white p-2 rounded-xl">
                  <QRCode value={`upi://pay?pa=${upiId}&pn=DarshanEase&am=${bookingData.totalAmount}&cu=INR`} size={160} />
                </div>
                <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">Scan with any UPI App</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-16 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 rounded-2xl text-xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                Confirm Payment
                <ChevronRight className="size-6" />
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em]">
            Secure 256-bit encrypted transaction
          </p>
        </div>
      </motion.div>
    </div>
  );
}
