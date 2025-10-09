import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorksSection";
import Navbar from "@/components/Navbar";
import GetHiredSection from "@/components/GetHiredSection";
import TrustedBySection from "@/components/TrustedBySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <GetHiredSection />
      <HowItWorksSection />
      <TrustedBySection />
      <CTASection />
      <Footer />
    </div>
  );
}
