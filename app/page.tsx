import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RealityCheckSection from "@/components/RealityCheckSection";
import FeaturesSection from "@/components/FeaturesSection";
import MascotSection from "@/components/MascotSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  const publicRelease = process.env.NEXT_PUBLIC_PUBLIC_RELEASE === "true";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection publicRelease={publicRelease} />
        <RealityCheckSection />
        <FeaturesSection />
        <MascotSection />
        <FinalCtaSection publicRelease={publicRelease} />
      </main>
      <Footer />
    </div>
  );
}
