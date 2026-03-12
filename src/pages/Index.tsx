import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppExplanation from "@/components/AppExplanation";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import FinancialToolsSection from "@/components/FinancialToolsSection";
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
      <Helmet>
        <title>Wallzy — Stop Guessing, Start Earning More Credit Card Rewards</title>
        <meta name="description" content="Wallzy helps you earn more from every purchase. Use our Credit Card Rewards Calculator and Card Comparison Tool to find the best card for your spending habits." />
        <link rel="canonical" href="https://wallzy.com/" />
        <meta property="og:url" content="https://wallzy.com/" />
        <meta property="og:title" content="Wallzy — Stop Guessing, Start Earning More Credit Card Rewards" />
        <meta property="og:description" content="Wallzy helps you earn more from every purchase. Use our Credit Card Rewards Calculator and Card Comparison Tool to find the best card for your spending habits." />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is Wallzy?",
                "acceptedAnswer": { "@type": "Answer", "text": "Wallzy is an app that sends you a simple notification recommending the best credit card to use whenever you shop. No spreadsheets, no guessing. Just the right card at the right time." }
              },
              {
                "@type": "Question",
                "name": "How does Wallzy work?",
                "acceptedAnswer": { "@type": "Answer", "text": "When you're near a store, Wallzy sends you a quiet notification recommending which card in your wallet earns the best rewards there. Once you leave, the notification disappears automatically." }
              },
              {
                "@type": "Question",
                "name": "Is Wallzy safe, and can it hurt my credit score?",
                "acceptedAnswer": { "@type": "Answer", "text": "Wallzy is completely safe and has no impact on your credit score. We never link to your bank accounts — you simply tell us which cards you own, and we take care of the rest." }
              },
              {
                "@type": "Question",
                "name": "How is Wallzy different from other recommendation apps?",
                "acceptedAnswer": { "@type": "Answer", "text": "Wallzy has no affiliation with any bank, so our recommendations are always in your best interest. We also take a set-it-and-forget-it approach: once you're set up, you never need to open the app again." }
              },
              {
                "@type": "Question",
                "name": "How can I get early access to Wallzy?",
                "acceptedAnswer": { "@type": "Answer", "text": "Join our waitlist right here on the website. We're currently in beta, working closely with early users and refining the product based on their feedback." }
              },
              {
                "@type": "Question",
                "name": "Is Wallzy free to use?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes, Wallzy is completely free to use." }
              }
            ]
          }
        `}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <AppExplanation />
      <FeaturesSection />
      <AboutSection />
      <FinancialToolsSection />
      <WaitlistSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
