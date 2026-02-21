import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, CheckCircle2, Info } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

// Images from user
const templeBackgrounds: Record<number, string[]> = {
  1: ["/shirdipremise.jpg", "/Shirdideity.jpg"],
  2: ["/tirupati.jpg", "/govinda.jpg"],
  3: ["/mhlxmitemple.jpg", "/Mahalaxmi.jpg"],
  4: ["/Pandharpur.jpg", "/vitthal.jpg"],
  5: ["/tuljatemple.jpg", "/tuljabhavani.jpg"],
};


interface SlotSelectionPageProps {
  selectedTempleId: number;
  onBookingSubmit: (data: any) => void;
}

export function SlotSelectionPage({ selectedTempleId, onBookingSubmit }: SlotSelectionPageProps) {
  const [bgIndex, setBgIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [selectedSubSlot, setSelectedSubSlot] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    hasDisability: "no",
    isPregnant: "no",
    adults: 1,
    children: 0,
  });
const defaultBackgrounds = ["/shirdipremise.jpg", "/Shirdideity.jpg"];

const backgrounds =
  templeBackgrounds[selectedTempleId] || defaultBackgrounds;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds]);

  const pricePerHead = 10;
  const totalPrice = (Number(formData.adults) + Number(formData.children)) * pricePerHead;

  const hours = ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];
  
  const getSubSlots = (hour: string) => {
    const time = hour.split(' ')[0]; // e.g., "07:00"
    const period = hour.split(' ')[1]; // e.g., "AM"
    const hourNum = time.split(':')[0];
    
    return [
      { time: `${hourNum}:00 ${period}`, remaining: 12 },
      { time: `${hourNum}:15 ${period}`, remaining: 5 },
      { time: `${hourNum}:30 ${period}`, remaining: 8 },
      { time: `${hourNum}:45 ${period}`, remaining: 15 },
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHour || !selectedSubSlot) {
      alert("Please select a time slot");
      return;
    }
    onBookingSubmit({
      ...formData,
      date: selectedDate,
      slot: selectedSubSlot,
      totalAmount: totalPrice,
      templeId: selectedTempleId
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-950 font-sans text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={backgrounds[bgIndex]}
              alt="Temple Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/90 via-slate-900/80 to-teal-950/90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400">
              Book Your Darshan
            </h1>
            <p className="text-cyan-100/70">Complete your details to secure your divine visit</p>
          </div>
          <div className="bg-teal-500/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-teal-500/30 flex items-center gap-3 self-center">
            <span className="text-teal-400 font-bold text-xl">₹{totalPrice}</span>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-xs uppercase tracking-widest text-teal-100/50">Total Payable</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">1</div>
                <h3 className="text-xl font-semibold">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-teal-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input 
                    required
                    type="number"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <Label>Any physical disability?</Label>
                  <RadioGroup 
                    value={formData.hasDisability}
                    onValueChange={(v) => setFormData({...formData, hasDisability: v})}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <RadioGroupItem value="yes" id="d-yes" className="border-teal-400 text-teal-400" />
                      <Label htmlFor="d-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <RadioGroupItem value="no" id="d-no" className="border-teal-400 text-teal-400" />
                      <Label htmlFor="d-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label>Are you pregnant?</Label>
                  <RadioGroup 
                    value={formData.isPregnant}
                    onValueChange={(v) => setFormData({...formData, isPregnant: v})}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <RadioGroupItem value="yes" id="p-yes" className="border-teal-400 text-teal-400" />
                      <Label htmlFor="p-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                      <RadioGroupItem value="no" id="p-no" className="border-teal-400 text-teal-400" />
                      <Label htmlFor="p-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </section>

            <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">2</div>
                <h3 className="text-xl font-semibold">Number of People</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Adults <span className="text-[10px] text-teal-400">(₹10/head)</span></Label>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, adults: Math.max(1, formData.adults - 1)})}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                    > - </button>
                    <span className="text-xl font-bold w-8 text-center">{formData.adults}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, adults: formData.adults + 1})}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                    > + </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Children <span className="text-[10px] text-teal-400">(₹10/head)</span></Label>
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, children: Math.max(0, formData.children - 1)})}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                    > - </button>
                    <span className="text-xl font-bold w-8 text-center">{formData.children}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, children: formData.children + 1})}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                    > + </button>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Calendar & Slots */}
          <div className="lg:col-span-5 space-y-6">
            <section className="glass-panel p-6 rounded-3xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="text-teal-400" />
                <h3 className="text-lg font-semibold">Select Date</h3>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 flex justify-center custom-calendar">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto"
                />
              </div>
            </section>

            <section className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-teal-400" />
                <h3 className="text-lg font-semibold">Select Time Slot</h3>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs uppercase tracking-widest text-white/50">Hourly Window</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setSelectedHour(h)}
                      className={`py-2 text-xs rounded-lg transition-all border ${
                        selectedHour === h 
                          ? "bg-teal-500 border-teal-400 text-white shadow-lg shadow-teal-500/20" 
                          : "bg-white/5 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedHour && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      <Label className="text-xs uppercase tracking-widest text-white/50">15-Min Sub-Slots</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {getSubSlots(selectedHour).map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedSubSlot(slot.time)}
                            className={`py-3 text-sm rounded-xl transition-all border flex flex-col items-center justify-center gap-1 ${
                              selectedSubSlot === slot.time 
                                ? "bg-cyan-500 border-cyan-400 text-white" 
                                : "bg-white/5 border-white/5 hover:border-white/20"
                            }`}
                          >
                            <span className="font-bold">{slot.time}</span>
                            <span className={`text-[10px] ${selectedSubSlot === slot.time ? 'text-cyan-100' : 'text-teal-400'}`}>
                              {slot.remaining} slots left
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3 text-amber-200/80 text-xs italic">
              <Info className="size-5 shrink-0 text-amber-500" />
              <p>Please arrive at the temple complex 30 minutes before your selected slot for security screening and verification.</p>
            </div>
          </div>

          {/* Full Width Payment Button */}
          <div className="lg:col-span-12 mt-4">
            <button
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl text-xl font-bold shadow-xl hover:shadow-teal-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
            >
              Proceed to Payment (₹{totalPrice})
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .custom-calendar .rdp {
          --rdp-accent-color: #14b8a6;
          --rdp-background-color: #ffffff10;
          margin: 0;
        }
        .custom-calendar .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          font-weight: bold;
        }
        .custom-calendar .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
}
