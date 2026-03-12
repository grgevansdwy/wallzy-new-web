import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CCPortfolioMaker from "./pages/CCPortfolioMaker";
import CardComparison from "./pages/CardComparison";
import Product from "./pages/Product";
import TheVision from "./pages/TheVision";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/byw" element={<CCPortfolioMaker />} />
            <Route path="/byw/cards" element={<CCPortfolioMaker />} />
            <Route path="/compare" element={<CardComparison />} />
            <Route path="/product" element={<Product />} />
            <Route path="/thevision" element={<TheVision />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/tos" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
