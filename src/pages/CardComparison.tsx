import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { addToWaitlist } from "@/lib/firebase";
import { ArrowRight, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CardComparison = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await addToWaitlist(email, "card-comparison-popup");
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* SEO-visible content above the iframe */}
      <div style={{ marginTop: "88px" }}>
        <div className="sr-only">
          <h1>Card Comparison Tool — Compare Every Credit Card</h1>
          <p>
            Compare every major US credit card side by side. Filter by category
            — cash back, travel, airline, hotel, student, secured, and business
            — sort by rating, APR, rewards rate, or annual fee, and compare up
            to four cards at once. Find the perfect credit card for your
            spending habits.
          </p>
        </div>
        <iframe
          src="/card-comparison.html"
          style={{ width: "100%", height: "calc(100vh - 88px)", border: "none", display: "block" }}
          title="Card Comparison Tool — Compare Every US Credit Card"
        />
      </div>

      {/* Email capture popup */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 w-full max-w-md relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h3>
                <p className="text-gray-500">We'll notify you when Wallzy is ready.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Like what you see?
                </h2>
                <p className="text-gray-500 mb-6">
                  Join our waitlist to get early access to Wallzy — the smarter way to manage your credit cards.
                </p>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-xl font-bold group"
                    disabled={loading}
                  >
                    {loading ? "Joining..." : "Join the Waitlist"}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-4">No spam, ever.</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CardComparison;
