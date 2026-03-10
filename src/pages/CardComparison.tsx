import Navbar from "@/components/Navbar";

const CardComparison = () => {
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
    </>
  );
};

export default CardComparison;
