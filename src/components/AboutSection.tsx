import { GraduationCap, Heart, Target } from "lucide-react";
import logo from "@/assets/logo_2.png";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8 flex items-center justify-center gap-0">
            About Wallzy
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-12">
            We <b>hate seeing money go to waste</b>. Everyone wants the best
            deal, so we built Wallzy to
            <b> optimize rewards and build credit portfolio</b> for everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg border border-border">
              <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                Wallzy empowers you to get more from every purchase. We show you
                which credit card to use in real-time, making rewards simple,
                transparent, and accessible.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lg border border-border">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                To transform how people interact with their finances by building
                intelligent tools that simplify, maximize, and put control back
                in their hands.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
