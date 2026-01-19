import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppExplanation from "@/components/AppExplanation";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import WaitlistSection from "@/components/WaitlistSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
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
