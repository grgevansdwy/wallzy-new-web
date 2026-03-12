import { ArrowRight, BookOpen, CreditCard, LineChart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  {
    value: "216M+",
    label: "US adults hold at least one credit card",
    source: "Federal Reserve SHED Report, 2024",
    sourceUrl: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-banking-and-credit.htm",
  },
  {
    value: "71%",
    label: "Of rewards cardholders are currently sitting on unused cash back, points, or miles",
    source: "LendingTree, 2025",
    sourceUrl: "https://www.lendingtree.com/credit-cards/study/unused-cash-back-points-miles/",
  },
  {
    value: "45%",
    label: "Of Americans are confused about their credit card rewards",
    source: "NextAdvisor survey via PYMNTS",
    sourceUrl: "https://www.pymnts.com/consumer-finance/2018/americans-confused-credit-card-rewards-program-frequent-flyer-miles-travel-loyalty/",
  },
];

const TheVision = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>The Vision — Wallzy</title>
        <meta name="description" content="Americans leave $6B+ in credit card rewards on the table every year. Wallzy is the first passive solution that fixes the behaviour, not just the awareness. See the market opportunity." />
        <link rel="canonical" href="https://wallzy.com/thevision" />
        <meta property="og:url" content="https://wallzy.com/thevision" />
        <meta property="og:title" content="The Vision — Wallzy" />
        <meta property="og:description" content="Americans leave $6B+ in credit card rewards on the table every year. Wallzy is the first passive solution that fixes the behaviour, not just the awareness." />
      </Helmet>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden pt-32 pb-48">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              A massive problem.
              <br />
              <span className="text-secondary">A passive solution.</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Every year, Americans leave billions in credit card rewards unearned. Not because they don't care. Because no one has built a solution that fits how people actually live. That's exactly what Wallzy does.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 40C1200 10 960 0 720 0C480 0 240 10 0 40Z" fill="hsl(210 20% 96%)" />
          </svg>
        </div>
      </section>

      {/* ── MARKET + STATS ───────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                A massive, underserved market
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Credit card rewards optimization is a multi-billion dollar opportunity that no consumer app has cracked. Something that no one is solving for.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* Row 1 — market size */}
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm flex flex-col">
                <div className="text-4xl font-black text-primary mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>53M+</div>
                <p className="text-muted-foreground text-sm flex-1 mb-4">Americans hold 3 or more credit cards, the core audience with the most to gain from smart card routing</p>
                <a href="https://capitaloneshopping.com/research/average-number-of-credit-cards-per-person/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary/40 hover:text-primary/70 transition-colors underline underline-offset-2">Capital One Shopping Research</a>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm flex flex-col">
                <div className="text-4xl font-black text-primary mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>$41.4B</div>
                <p className="text-muted-foreground text-sm flex-1 mb-4">In credit card rewards issued to US consumers in 2022</p>
                <a href="https://www.consumerfinance.gov/data-research/research-reports/the-consumer-credit-card-market-2025/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary/40 hover:text-primary/70 transition-colors underline underline-offset-2">CFPB Credit Card Market Report</a>
              </div>
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm flex flex-col">
                <div className="text-4xl font-black text-primary mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>$6B+</div>
                <p className="text-muted-foreground text-sm flex-1 mb-4">In earned rewards left unredeemed by Americans every year</p>
                <a href="https://www.consumerfinance.gov/data-research/research-reports/the-consumer-credit-card-market-2025/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary/40 hover:text-primary/70 transition-colors underline underline-offset-2">CFPB Credit Card Market Report</a>
              </div>

              {/* Row 2 — behaviour gap */}
              {stats.map((stat) => (
                <div key={stat.value} className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm flex flex-col">
                  <div className="text-4xl font-black text-primary mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stat.value}
                  </div>
                  <p className="text-muted-foreground text-sm flex-1 mb-4 leading-relaxed">{stat.label}</p>
                  <a href={stat.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/40 hover:text-primary/70 transition-colors underline underline-offset-2">
                    {stat.source}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
              The problem is behaviour,{" "}
              <span className="bg-secondary text-secondary-foreground rounded-lg px-3 py-1 whitespace-nowrap inline-block mt-1">not awareness.</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              53 million Americans carry three or more credit cards in their wallet. But at checkout,
              they tap the same one every time. Not because it's the best option. Because it's the default.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              That habit costs them hundreds of dollars a year in missed rewards. And no existing app has solved
              it, because they all ask users to do something. Look something up. Open something. Decide something.
              <strong className="text-white"> Wallzy is the first solution that works without breaking the habit. It just makes the habit smarter.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Rewards is just the entry point.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The notification is step one. The real opportunity is eliminating the decision entirely — one tap, always the right card.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Rewards Optimization</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The core product. Passive, location-aware card recommendations delivered as a quiet notification — no app to open, no decision to make. This is where it starts.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">Now</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Single Card Routing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One Wallzy card in your wallet. Tap it anywhere, and it automatically routes the transaction to whichever card in your portfolio earns the most rewards at that merchant. No thinking. No switching. Just the best card, every time.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">Next</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Portfolio Intelligence</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  With real spending data flowing through the Wallzy card, we can tell users exactly which cards are earning their keep — and which ones aren't worth the annual fee.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">Long-term</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Financial Education</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most people didn't learn this stuff in school. Wallzy is positioned to be the trusted, unbiased voice that explains personal finance in plain language, at exactly the moment it's relevant.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full">Long-term</div>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-8 text-sm max-w-xl mx-auto">
              Each layer removes more friction — from a nudge, to a tap, to a card that just knows.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-primary rounded-3xl px-10 py-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Want to learn more?
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
                See how the product works, or get in touch directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-6 text-lg rounded-xl group">
                  <Link to="/product">
                    See the Product
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white/40 text-white bg-transparent hover:bg-white/10 font-semibold px-10 py-6 text-lg rounded-xl group">
                  <a href="mailto:wallzywallet@gmail.com">
                    Get in Touch
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TheVision;
