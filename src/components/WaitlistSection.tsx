import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="waitlist" className="py-20 lg:py-32 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Join Our Waitlist
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
            Be among the first UW students to experience Wallzy. Get early
            access and start maximizing your credit card rewards today.
          </p>

          {submitted ? (
            <div className="bg-primary-foreground/10 backdrop-blur-lg rounded-2xl p-8 border border-primary-foreground/20 animate-fade-in-up">
              <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-2">
                You're on the list!
              </h3>
              <p className="text-primary-foreground/80">
                We'll notify you when Wallzy is ready for you. Thanks for
                joining!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your @uw.edu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-14 rounded-xl"
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 h-14 rounded-xl group"
                >
                  Join
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/60">
                No spam, ever. We'll only send you updates about Wallzy.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
