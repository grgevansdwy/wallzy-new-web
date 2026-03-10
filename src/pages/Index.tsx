import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppExplanation from "@/components/AppExplanation";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import WaitlistSection from "@/components/WaitlistSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AppExplanation />
      <FeaturesSection />
      <AboutSection />
      <WaitlistSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
