import { ArrowRight, BarChart2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import compareScreenshot from "@/assets/compare-screenshot.png";
import calculatorScreenshot from "@/assets/calculator-screenshot.png";

const tools = [
  {
    icon: Search,
    label: "Card Comparison Tool",
    tagline: "Compare Every Card. Pick the Perfect One.",
    description:
      "Filter and compare every major US credit card by rewards, fees, credit score, and more — all in one place.",
    cta: "Compare Cards",
    to: "/compare",
    screenshot: compareScreenshot,
    tilt: "perspective(1200px) rotateY(-6deg) rotateX(3deg) rotate(1deg)",
    accent: "bg-secondary/30",
    iconColor: "text-secondary-foreground",
  },
  {
    icon: BarChart2,
    label: "Rewards Calculator",
    tagline: "See Exactly What You're Earning.",
    description:
      "Enter your spending habits and instantly find out which cards in your wallet are working hardest — and which ones aren't.",
    cta: "Calculate Rewards",
    to: "/byw",
    screenshot: calculatorScreenshot,
    tilt: "perspective(1200px) rotateY(6deg) rotateX(3deg) rotate(-1deg)",
    accent: "bg-white/10",
    iconColor: "text-white",
  },
];

const FinancialToolsSection = () => {
  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Know your cards.{" "}
            <span
              className="bg-secondary text-secondary-foreground rounded-lg inline-block"
              style={{ padding: "4px 14px" }}
            >
              Own your money.
            </span>
          </h2>
          <p className="text-white/70 text-lg">
            Two free tools to help you understand, compare, and get more from every card in your wallet.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.to}
              className="bg-white/10 border border-white/20 rounded-3xl overflow-hidden flex flex-col shadow-xl"
            >
              {/* Screenshot */}
              <div className="relative bg-white px-8 pt-8 pb-0 overflow-hidden h-64">
                {/* Fade into card */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none z-10" />
                <div
                  className="relative z-0 rounded-t-xl overflow-hidden shadow-2xl border border-white/10"
                  style={{ transform: tool.tilt }}
                >
                  <img
                    src={tool.screenshot}
                    alt={tool.label}
                    className="w-full block"
                  />
                  {/* Gloss */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col gap-3 flex-1">
                <div className={`w-10 h-10 ${tool.accent} rounded-xl flex items-center justify-center`}>
                  <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">{tool.label}</p>
                <h3
                  className="text-xl font-bold text-white leading-snug"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {tool.tagline}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed flex-1">{tool.description}</p>
                <Link
                  to={tool.to}

                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 py-3 rounded-xl transition-colors group w-fit mt-2 text-sm"
                >
                  {tool.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FinancialToolsSection;
