import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RealityCheckSection from "@/components/RealityCheckSection";
import FeaturesSection from "@/components/FeaturesSection";
import MascotSection from "@/components/MascotSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RealityCheckSection />
        <FeaturesSection />
        <MascotSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}
