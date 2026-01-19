import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import cardGold from "@/assets/card-gold.png";
import cardBlue from "@/assets/card-blue.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen gradient-hero overflow-hidden pt-20"
    >
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
              Stop Guessing,
              <br />
              <span className="text-gradient">Start Earning.</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg">
              Helping University of Washington students maximize credit card
              rewards with smart, location-based notifications.
            </p>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-6 text-lg rounded-full group"
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            >
              Earn Rewards
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[400px] lg:h-[500px]">
            <img
              src={cardBlue}
              alt="Blue Credit Card"
              className="absolute top-0 right-0 lg:right-10 w-64 lg:w-80 floating-animation opacity-90"
              style={{ transform: "rotate(-15deg)" }}
            />
            <img
              src={cardGold}
              alt="Gold Credit Card"
              className="absolute bottom-10 right-20 lg:right-32 w-56 lg:w-72 floating-animation-delayed opacity-90"
              style={{ transform: "rotate(10deg)" }}
            />
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(210 20% 96%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
