import { Bell, MapPin, Users } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";

const features = [
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get instant notifications suggesting the best credit card to use for every in-person transaction. Never miss out on rewards again.",
  },
  {
    icon: MapPin,
    title: "UW Seattle Community",
    description:
      "Built by students, for students. Track which credit cards earn the most rewards at local spots around UW Seattle campus.",
  },
  {
    icon: Users,
    title: "Local Partnerships",
    description:
      "We work with local businesses around the UW community to bring you exclusive deals and maximize your earnings at every store you love.",
  },
];

const AppExplanation = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary mb-16">
          The Ultimate Credit Card
          <br />
          Management App
        </h2>

        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left Feature Cards */}
          <div className="flex flex-col gap-6 lg:w-80 order-2 lg:order-1">
            <div className="glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border/50 animate-fade-in-up animate-delay-100">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {features[0].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {features[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border/50 animate-fade-in-up animate-delay-300 lg:-ml-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {features[2].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {features[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative order-1 lg:order-2">
            <div
              className="relative z-10"
              style={{
                transform: "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
              }}
            >
              <img
                src={phoneMockup}
                alt="Wallzy App Interface"
                className="w-64 md:w-72 lg:w-80 drop-shadow-2xl"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl -z-10 scale-110" />
          </div>

          {/* Right Feature Card */}
          <div className="flex flex-col gap-6 lg:w-80 order-3">
            <div className="glass-card bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-border/50 animate-fade-in-up animate-delay-200 lg:ml-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-secondary/30">
                  <MapPin className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    {features[1].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {features[1].description}
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
