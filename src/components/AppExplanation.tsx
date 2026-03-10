import { CreditCard, Brain, FileText } from "lucide-react";
import phoneMockup from "@/assets/mockPhone3.svg";

const features = [
  {
    icon: CreditCard,
    title: "The One-Card Habit",
    description:
      "Most people default to one card for everything — and end up missing out on hundreds, sometimes thousands, in rewards every year.",
  },
  {
    icon: Brain,
    title: "Too Many Options",
    description:
      "With so many cards and merchant categories, it's hard to keep track of which card earns the most at each store.",
  },
  {
    icon: FileText,
    title: "Outgrown Cards",
    description:
      "Many people stick with their starter cards long after they've outgrown them, leaving a lot of earning potential on the table.",
  },
];

const AppExplanation = () => {
  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-24 bg-background relative"
    >
      {/* Gradient overlay at bottom for transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-primary/30 to-primary pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary mb-16 md:mb-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <div>The Real Cost of Picking</div>
          <div className="mt-2">
            the{" "}
            <span className="bg-secondary text-secondary-foreground font-bold rounded-lg inline-block" style={{ padding: "6px 14px" }}>
              Wrong Card.
            </span>
          </div>
        </h2>

        {/* Desktop Layout */}
        <div className="hidden lg:flex relative flex-col lg:flex-row items-center justify-center gap-2 lg:gap-3">
          {/* Left Feature Cards */}
          <div className="flex flex-col gap-28 lg:w-80 order-2 lg:order-1">
            <div className="group glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-7 shadow-lg border border-border/50 animate-fade-in-up animate-delay-100 transition-transform duration-300 relative z-20">
              <div className="flex items-start gap-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]">
                <div className="p-3 rounded-xl bg-primary/10">
                  {(() => {
                    const Icon = features[0].icon;
                    return <Icon className="w-6 h-6 text-primary" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    {features[0].title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {features[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-10 group glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-7 shadow-lg border border-border/50 animate-fade-in-up animate-delay-300 transition-transform duration-300 relative z-20">
              <div className="flex items-start gap-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]">
                <div className="p-3 rounded-xl bg-accent/20">
                  {(() => {
                    const Icon = features[2].icon;
                    return <Icon className="w-6 h-6 text-accent" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    {features[2].title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {features[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative order-1 lg:order-2 lg:-translate-x-6">
            <div
              className="relative z-10"
              style={{
                transform:
                  "perspective(1000px) rotateY(-5deg) rotateX(5deg) rotate(-6deg)",
              }}
            >
              <img
                src={phoneMockup}
                alt="Wallzy App Interface"
                className="w-full md:w-[26rem] lg:w-[34rem] drop-shadow-2xl rounded-[2.5rem]"
                style={{
                  backgroundColor: "transparent",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl -z-10 scale-110" />
          </div>

          {/* Right Feature Card */}
          <div className="flex flex-col gap-4 lg:w-80 order-3">
            <div className="group glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-7 shadow-lg border border-border/50 animate-fade-in-up animate-delay-200 transition-transform duration-300 relative z-20">
              <div className="flex items-start gap-4 transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]">
                <div className="p-3 rounded-xl bg-secondary/30">
                  {(() => {
                    const Icon = features[1].icon;
                    return (
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    );
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-lg mb-3">
                    {features[1].title}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {features[1].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - 2 rows */}
        <div className="lg:hidden flex flex-col gap-8 items-center">
          {/* Phone Mockup */}
          <div className="relative mb-6">
            <div
              className="relative z-10"
              style={{
                transform:
                  "perspective(1000px) rotateY(-5deg) rotateX(5deg) rotate(-6deg)",
              }}
            >
              <img
                src={phoneMockup}
                alt="Wallzy App Interface"
                className="w-full md:w-[26rem] drop-shadow-2xl rounded-[2.5rem]"
                style={{
                  backgroundColor: "transparent",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl -z-10 scale-110" />
          </div>

          {/* First Row: Lack of Knowledge + Stagnant Portfolio */}
          <div className="grid grid-cols-2 gap-4 w-full px-4">
            {/* Lack of Knowledge (features[1]) */}
            <div className="group glass-card bg-card/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-border/50 animate-fade-in-up animate-delay-200 transition-transform duration-300 relative z-20">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/30">
                  {(() => {
                    const Icon = features[1].icon;
                    return (
                      <Icon className="w-5 h-5 text-secondary-foreground" />
                    );
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-sm mb-2">
                    {features[1].title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {features[1].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stagnant Portfolio (features[2]) */}
            <div className="group glass-card bg-card/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-border/50 animate-fade-in-up animate-delay-300 transition-transform duration-300 relative z-20">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  {(() => {
                    const Icon = features[2].icon;
                    return <Icon className="w-5 h-5 text-accent" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-sm mb-2">
                    {features[2].title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {features[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Default Card (centered) */}
          <div className="w-full px-4 flex justify-center">
            <div className="group glass-card bg-card/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-border/50 animate-fade-in-up animate-delay-100 transition-transform duration-300 relative z-20 max-w-[50%]">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {(() => {
                    const Icon = features[0].icon;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-primary text-sm mb-2">
                    {features[0].title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {features[0].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppExplanation;
