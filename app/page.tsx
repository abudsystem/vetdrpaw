import Hero from "@/components/home/Hero";
import Values from "@/components/home/Values";
import Philosophy from "@/components/home/Philosophy";
import WelfarePolicy from "@/components/home/WelfarePolicy";
import History from "@/components/home/History";
import Calendar from "@/components/home/Calendar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Values />
      <Philosophy />
      <WelfarePolicy />
      <History />
      <Calendar />
    </div>
  );
}
