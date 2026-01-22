import { Settings, Bell, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Settings,
    title: "Set Once, Forget It",
    description:
      "Simply select the cards you own, no bank logins or personal data required. Wallzy helps you earn rewards, without you ever having to open the app.",
    color: "bg-primary",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get a quiet live notification for the best offers the moment you walk in. And once you leave, the notification disappears.",
    color: "bg-accent",
  },
  {
    icon: TrendingUp,
    title: "Earn more, effortlessly",
    description:
      "Never wonder which card to use again. Wallzy ensures you're using the best card for every single purchase.",
    color: "bg-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-primary">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary-foreground mb-4">
          Discover Your Credit Card's
        </h2>
        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-secondary mb-16">
          Maximum Potential
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-primary-foreground/10 backdrop-blur-lg rounded-2xl p-8 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-primary-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
