import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy — Wallzy</title>
        <meta name="description" content="Wallzy's Privacy Policy. Learn how we collect, use, and protect your information." />
        <link rel="canonical" href="https://wallzy.com/privacy" />
      </Helmet>
      <Navbar />

      <main className="container mx-auto px-6 py-24 max-w-3xl">
        <h1 className="text-4xl font-black text-primary mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: March 12, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wallzy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what
              information we collect, how we use it, and the choices you have. By using Wallzy's website or app, you
              agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-primary/80 mb-2">Information you provide</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li>Email address (when you join our waitlist)</li>
              <li>The credit cards you select within the app (by name only — no account numbers or bank credentials)</li>
            </ul>
            <h3 className="text-lg font-semibold text-primary/80 mb-2">Information collected automatically</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>General location data (used in-app to identify nearby merchants — never stored on our servers)</li>
              <li>Basic analytics data (page views, feature usage) via Google Analytics</li>
              <li>Device type and operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>To send you waitlist updates and product launch communications</li>
              <li>To power card recommendations within the Wallzy app</li>
              <li>To improve the product through anonymous usage analytics</li>
              <li>To respond to support requests or inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">4. What We Do NOT Do</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>We never link to your bank accounts</li>
              <li>We never store your credit card numbers, CVVs, or login credentials</li>
              <li>We never sell your personal data to third parties</li>
              <li>We never share your email address with advertisers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">5. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using Firebase (Google Cloud infrastructure). We use industry-standard
              encryption in transit and at rest. Access to user data is restricted to authorized team members only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">6. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services, each governed by their own privacy policies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li>Google Analytics — website usage tracking</li>
              <li>Firebase — data storage and authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal data at any time. To make a request,
              contact us at{" "}
              <a href="mailto:wallzywallet@gmail.com" className="text-primary underline underline-offset-2">
                wallzywallet@gmail.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wallzy is not intended for users under the age of 18. We do not knowingly collect personal information
              from children. If we become aware that a child under 18 has provided us with personal data, we will
              delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date
              at the top of this page. Continued use of Wallzy after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:wallzywallet@gmail.com" className="text-primary underline underline-offset-2">
                wallzywallet@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
