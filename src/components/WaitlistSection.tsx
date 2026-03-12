import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToWaitlist } from "@/lib/firebase";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    console.log("Form submitted with email:", email);
    setLoading(true);
    setError("");

    try {
      console.log("Calling addToWaitlist...");
      const result = await addToWaitlist(email);
      console.log("Success:", result);
      setSubmitted(true);
      setEmail("");

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.log("Error caught:", err.message);
      setError(err.message || "Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="py-20 lg:py-32 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Join Our Waitlist!
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Be among the first to experience Wallzy and sign up to get notified for early access.
          </p>

          {submitted ? (
            <div className="bg-card rounded-2xl p-8 border border-border animate-fade-in-up shadow-sm">
              <CheckCircle className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary mb-2">
                You're on the list!
              </h3>
              <p className="text-muted-foreground">
                We'll notify you when Wallzy is ready for you. Thanks for
                joining!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground h-14 rounded-xl"
                  required
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold px-6 h-12 text-base rounded-xl group"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Join"}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
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
