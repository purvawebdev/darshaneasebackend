import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { LoginPage } from "./components/LoginPage";
import { TempleSelectionSplash } from "./components/TempleSelectionSplash";
import { TempleSelectionPage } from "./components/TempleSelectionPage";
import { SlotSelectionSplash } from "./components/SlotSelectionSplash";
import { SlotSelectionPage } from "./components/SlotSelectionPage";
import { PaymentPage } from "./components/PaymentPage";
import { BookingConfirmedSplash } from "./components/BookingConfirmedSplash";
import { BookingDetailsPage } from "./components/BookingDetailsPage";

type Step = 
  | "splash" 
  | "login" 
  | "selection-splash" 
  | "selection" 
  | "slot-splash" 
  | "slot-selection" 
  | "payment"
  | "booking-confirmed-splash" 
  | "booking-details";

export default function App() {
  const [step, setStep] = useState<Step>("splash");
  const [selectedTempleId, setSelectedTempleId] = useState<number>(1);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => setStep("login"), 3000);
      return () => clearTimeout(timer);
    }
    if (step === "selection-splash") {
      const timer = setTimeout(() => setStep("selection"), 3000);
      return () => clearTimeout(timer);
    }
    if (step === "slot-splash") {
      const timer = setTimeout(() => setStep("slot-selection"), 3000);
      return () => clearTimeout(timer);
    }
    if (step === "booking-confirmed-splash") {
      const timer = setTimeout(() => setStep("booking-details"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLoginSuccess = () => setStep("selection-splash");
  
  const handleTempleSelect = (id: number) => {
    setSelectedTempleId(id);
    setStep("slot-splash");
  };

  const handleBookingSubmit = (data: any) => {
    setBookingData(data);
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("booking-confirmed-splash");
  };

  const handleReset = () => {
    setStep("selection");
    setBookingData(null);
  };

  return (
    <>
      {step === "splash" && <SplashScreen />}
      {step === "login" && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {step === "selection-splash" && <TempleSelectionSplash />}
      {step === "selection" && <TempleSelectionPage onSelectTemple={handleTempleSelect} />}
      {step === "slot-splash" && <SlotSelectionSplash />}
      {step === "slot-selection" && (
        <SlotSelectionPage 
          selectedTempleId={selectedTempleId} 
          onBookingSubmit={handleBookingSubmit} 
        />
      )}
      {step === "payment" && (
        <PaymentPage 
          bookingData={bookingData} 
          onPaymentSuccess={handlePaymentSuccess} 
          onBack={() => setStep("slot-selection")}
        />
      )}
      {step === "booking-confirmed-splash" && <BookingConfirmedSplash />}
      {step === "booking-details" && (
        <BookingDetailsPage 
          bookingData={bookingData} 
          onDone={handleReset} 
        />
      )}
    </>
  );
}
