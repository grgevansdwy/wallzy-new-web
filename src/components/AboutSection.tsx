import { GraduationCap, Heart, Target } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Made by UW Students</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8">
            About Us
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
            We're a team of University of Washington students passionate about
            helping our fellow Huskies take control of their personal finances.
            We noticed that managing multiple credit cards and optimizing
            rewards was confusing and time-consuming—so we built Wallzy to solve
            exactly that problem.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To empower students to make smarter financial decisions and
                maximize the value of every dollar they spend, one swipe at a
                time.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Our Focus
              </h3>
              <p className="text-muted-foreground">
                Simplifying credit card management and reward optimization so
                you can focus on what matters—your education and experiences at
                UW.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
