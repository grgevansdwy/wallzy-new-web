import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-primary overflow-hidden pt-20"
    >
      {/* Light beam decorative elements */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[800px] opacity-30">
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-accent/40 to-transparent"
          style={{ transform: "rotate(-15deg) translateX(100px)" }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight tracking-tight">
              Stop Guessing,
              <br />
              <span className="inline-block">
                Start{" "}
                <span className="bg-secondary text-secondary-foreground px-3 py-1">
                  Earning.
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg">
              Helping University of Washington students to earn more.
            </p>
            <Button
              size="lg"
              className="bg-accent text-primary-foreground hover:bg-accent/90 font-semibold px-8 py-6 text-lg rounded-lg group"
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Earning
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Glassmorphism Cards */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* Blue glassmorphism card */}
            <div
              className="absolute top-0 right-0 lg:right-10 w-64 lg:w-80 h-44 lg:h-52 rounded-2xl floating-animation glass-hero-card"
              style={{ transform: "rotate(-12deg)" }}
            >
              <div className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20" />
            </div>
            
            {/* Gold/Yellow card */}
            <div
              className="absolute bottom-16 right-16 lg:right-28 w-56 lg:w-72 h-36 lg:h-44 rounded-2xl floating-animation-delayed bg-secondary/90 shadow-xl"
              style={{ transform: "rotate(8deg)" }}
            >
              <div className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave - connects to next section */}
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
