import { motion } from "motion/react";
import { Download, Share2, Printer, MapPin, Calendar, Clock, User, Fingerprint, ReceiptIndianRupee, QrCode as QrIcon } from "lucide-react";
import { Button } from "./ui/button";
import QRCode from "react-qr-code";

interface BookingDetailsPageProps {
  bookingData: any;
  onDone: () => void;
}

export function BookingDetailsPage({ bookingData, onDone }: BookingDetailsPageProps) {
  const bookingId = "DE-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const templeNames: Record<number, string> = {
    1: "Shirdi Saibaba Temple",
    2: "Tirupati Balaji Temple",
    3: "Mahalaxmi Temple, Kolhapur",
    4: "Shri Vitthal Rukmini Temple",
    5: "Shri Tulja Bhavani Mandir"
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Success Header */}
      <div className="bg-teal-600 pt-12 pb-24 px-4 text-center text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
        >
          <Fingerprint className="size-8" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Darshan E-Pass</h1>
        <p className="text-teal-100/80">Digital Invoice & Booking Details</p>
      </div>

      {/* Main Content Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-16">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[32px] shadow-2xl overflow-hidden"
        >
          {/* Booking ID & Status */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Booking ID</p>
              <h2 className="text-xl font-mono font-bold">{bookingId}</h2>
            </div>
            <div className="bg-teal-500/20 text-teal-400 px-4 py-1 rounded-full text-xs font-bold border border-teal-500/30 uppercase tracking-wider">
              Confirmed
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Essential Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <User className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Primary Devotee</p>
                    <p className="font-bold">{bookingData.name} ({bookingData.age} Years)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Temple Destination</p>
                    <p className="font-bold">{templeNames[bookingData.templeId] || "Temple"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Darshan Date</p>
                    <p className="font-bold">{formatDate(bookingData.date || new Date())}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Time Slot</p>
                    <p className="font-bold">{bookingData.slot}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification QR */}
            <div className="bg-slate-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8 border border-white/10">
              <div className="bg-white p-3 rounded-2xl shrink-0">
                <QRCode value={`VERIFY-DARSHAN-${bookingId}`} size={140} />
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <QrIcon className="size-5 text-teal-400" />
                  Verification QR
                </h3>
                <p className="text-slate-400 text-sm">
                  Show this unique QR code at the temple entrance for quick verification and skip the manual checking process.
                </p>
                <p className="text-[10px] text-teal-500 font-mono uppercase tracking-[0.2em] pt-2">
                  Valid for 1-time entry only
                </p>
              </div>
            </div>

            {/* billing section */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ReceiptIndianRupee className="size-5 text-teal-600" />
                Invoice Summary
              </h3>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Adults (x{bookingData.adults})</span>
                  <span className="font-medium">₹{bookingData.adults * 10}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Children (x{bookingData.children})</span>
                  <span className="font-medium">₹{bookingData.children * 10}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction Fee</span>
                  <span className="font-medium text-teal-600">Free</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-2xl font-black text-teal-600">₹{bookingData.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Other details */}
            <div className="flex gap-4 text-xs text-slate-400 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
               <div className="flex items-center gap-1">
                 <span className="font-bold text-teal-700">Disability Priority:</span> {bookingData.hasDisability === 'yes' ? 'Enabled' : 'None'}
               </div>
               <div className="w-px h-3 bg-teal-200" />
               <div className="flex items-center gap-1">
                 <span className="font-bold text-teal-700">Special Care:</span> {bookingData.isPregnant === 'yes' ? 'Requested' : 'None'}
               </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="outline" className="h-12 rounded-xl border-slate-200 flex gap-2">
                <Download className="size-4" /> Download
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-slate-200 flex gap-2">
                <Share2 className="size-4" /> Share
              </Button>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-50 p-8 text-center border-t border-slate-100">
            <p className="text-lg font-bold text-slate-900 mb-1">Thank you for using DarshanEase!</p>
            <p className="text-teal-600 font-medium italic">Smart Darshan, Less Waiting!</p>
            <button 
              onClick={onDone}
              className="mt-8 text-sm font-bold text-teal-600 hover:text-teal-700 underline"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
