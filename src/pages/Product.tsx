import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Bell, CreditCard, MapPin, Pause, Play, Shield, Smartphone, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import phoneMockup from "@/assets/mockPhone3.svg";
import logo from "@/assets/logo_2.png";
import cardBlue from "@/assets/card-blue.png";
import cardGold from "@/assets/card-gold.png";


const steps = [
  {
    number: "01",
    title: "Tell us your cards",
    description:
      "Open the app once, select the credit cards you carry. No bank logins. No account linking. No sensitive data.",
    icon: CreditCard,
  },
  {
    number: "02",
    title: "Walk into a store",
    description:
      "Wallzy detects your location in the background and instantly calculates which card earns the most rewards at that specific merchant.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "Get a quiet nudge",
    description:
      "A single, clean notification surfaces on your lock screen: \"Use your Chase Sapphire here — 3x points on dining.\" That's it.",
    icon: Bell,
  },
  {
    number: "04",
    title: "Notification disappears",
    description:
      "Once you leave the store, the notification clears itself. No clutter, no app to open, no ongoing input required.",
    icon: Zap,
  },
];

const features = [
  {
    icon: Shield,
    title: "Privacy-first architecture",
    description:
      "We never touch your bank account, transaction history, or personal financial data. You tell us what cards you own — we do the rest from our end. Wallzy is the only rewards optimizer built this way.",
  },
  {
    icon: Smartphone,
    title: "Set-it-and-forget-it",
    description:
      "Most financial apps demand ongoing attention. Wallzy demands none. After a one-time setup, users never need to open the app again. The value is delivered passively, exactly when it matters.",
  },
  {
    icon: TrendingUp,
    title: "Reward intelligence engine",
    description:
      "Our database maps thousands of merchants to card category codes in real time, so recommendations are accurate down to individual store locations — not just category guesses.",
  },
  {
    icon: Users,
    title: "No affiliation, no conflict",
    description:
      "We have no deals with card issuers. No referral kickbacks distorting our recommendations. Wallzy's incentive is aligned entirely with the user: the better the recommendation, the more rewards they earn.",
  },
];

const differentiators = [
  { label: "No bank login required", wallzy: true, competitors: false },
  { label: "Passive, location-based alerts", wallzy: true, competitors: false },
  { label: "Notification clears on exit", wallzy: true, competitors: false },
  { label: "Works without opening the app", wallzy: true, competitors: false },
  { label: "Unaffiliated with card issuers", wallzy: true, competitors: false },
  { label: "Real-time merchant mapping", wallzy: true, competitors: false },
];

const Product = () => {
  const [animPaused, setAnimPaused] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>How Wallzy Works — Same Wallet, More Rewards</title>
        <meta name="description" content="See how Wallzy's passive credit card recommendation engine works. Set it up once, and get a quiet nudge every time you're near a store — always using your best card." />
        <link rel="canonical" href="https://wallzywallet.com/product" />
        <meta property="og:url" content="https://wallzywallet.com/product" />
        <meta property="og:title" content="How Wallzy Works — Same Wallet, More Rewards" />
        <meta property="og:description" content="Set it up once, and get a quiet nudge every time you're near a store — always using your best card." />
      </Helmet>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Same wallet.
              <br />
              <span className="text-secondary">More rewards.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Wallzy is the passive credit card optimizer that tells you exactly which card to use,
              exactly when you need it — without ever asking you to open an app.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-8 py-6 text-lg rounded-xl group"
                onClick={() => document.getElementById("waitlist-cta")?.scrollIntoView({ behavior: "smooth" })}
              >
                Join the Waitlist
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 40C1200 10 960 0 720 0C480 0 240 10 0 40Z" fill="hsl(210 20% 96%)" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              How Wallzy works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Four steps. One setup. Passive rewards optimization, forever.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center group-hover:bg-secondary transition-colors duration-300">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground/50 tracking-widest mb-1">{step.number}</div>
                    <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Phone mockup */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div
                  className="relative z-10"
                  style={{ transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg) rotate(-4deg)" }}
                >
                  <img
                    src={phoneMockup}
                    alt="Wallzy App"
                    className="w-72 md:w-80 drop-shadow-2xl rounded-[2.5rem]"
                    style={{ backgroundColor: "transparent", mixBlendMode: "multiply" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20 blur-3xl -z-10 scale-110" />

                {/* Floating notification card */}
                <div
                  className="absolute -left-8 top-1/3 bg-white rounded-2xl shadow-2xl p-4 w-56 z-20 border border-border animate-bounce"
                  style={{ animationDuration: "3s", animationPlayState: animPaused ? "paused" : "running" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">Wallzy</p>
                      <p className="text-xs text-muted-foreground leading-tight">Use Chase Sapphire here — 3× dining</p>
                    </div>
                  </div>
                </div>

                {/* Floating reward card */}
                <div
                  className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-2xl p-4 w-44 z-20 border border-border animate-bounce"
                  style={{ animationDuration: "3s", animationDelay: "0.5s", animationPlayState: animPaused ? "paused" : "running" }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Est. this month</p>
                  <p className="text-2xl font-black text-secondary">+$34</p>
                  <p className="text-xs text-muted-foreground">in rewards earned</p>
                </div>

                {/* Pause/play button */}
                <button
                  onClick={() => setAnimPaused((p) => !p)}
                  className="absolute top-0 right-0 bg-white/80 hover:bg-white border border-border rounded-full p-1.5 text-muted-foreground shadow-sm transition-colors z-30"
                >
                  {animPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Every decision{" "}
              <span className="bg-secondary text-secondary-foreground rounded-lg px-3 py-1">starts with you.</span>
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Every product decision at Wallzy starts from the same question: does this reduce friction for the user?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITIVE DIFFERENTIATOR ───────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Why Wallzy wins
              </h2>
              <p className="text-muted-foreground">
                Compared to existing card optimization apps, browser extensions, and manual trackers.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-primary/5 border-b border-border items-center">
                <div className="p-4 text-sm font-bold text-primary text-center">Feature</div>
                <div className="p-4 text-center">
                  <img src={logo} alt="Wallzy" className="h-10 mx-auto" />
                </div>
                <div className="p-4 text-center text-sm font-bold text-primary">Other Apps</div>
              </div>

              {differentiators.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
                >
                  <div className="p-4 text-sm text-muted-foreground flex items-center justify-center text-center">{row.label}</div>
                  <div className="p-4 flex items-center justify-center">
                    {row.wallzy ? (
                      <span className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">✓</span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-400 text-sm">✗</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    {row.competitors ? (
                      <span className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">✓</span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-400 text-sm">✗</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISUAL CARDS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Works with every card{" "}
                <span className="bg-secondary text-secondary-foreground rounded-lg px-3 py-1 inline-block mt-2">you already carry.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Wallzy supports every major US credit card issuer and maps thousands of merchants to their
                exact reward categories. Cash back, points, miles — we track them all and surface the highest-earning
                option in your wallet.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As card benefits evolve, our database updates automatically. Users always get accurate,
                up-to-date recommendations without lifting a finger.
              </p>
            </div>

            {/* Card stack visual */}
            <div className="relative h-80 flex items-center justify-center">
              <div className="relative w-72">
                <img
                  src={cardBlue}
                  alt="Credit card"
                  className="absolute -top-12 left-4 w-60 rounded-2xl shadow-xl"
                  style={{ transform: "rotate(-8deg)" }}
                />
                <img
                  src={cardGold}
                  alt="Credit card"
                  className="absolute -top-6 left-10 w-60 rounded-2xl shadow-xl"
                  style={{ transform: "rotate(4deg)" }}
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-border px-6 py-3 whitespace-nowrap z-10">
                  <p className="text-xs text-muted-foreground">Best card here</p>
                  <p className="text-sm font-bold text-secondary">Chase Sapphire — 3× pts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST CTA ─────────────────────────────────────────────── */}
      <section id="waitlist-cta" className="py-24 bg-primary">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Be first in line.
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Wallzy is in beta. Join our waitlist and be among the first to start earning more from every purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-10 py-6 text-lg rounded-xl group"
              >
                <Link to="/#waitlist">
                  Join the Waitlist
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Product;
