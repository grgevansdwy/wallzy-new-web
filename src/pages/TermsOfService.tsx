import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service — Wallzy</title>
        <meta name="description" content="Wallzy's Terms of Service. Read the terms governing your use of the Wallzy app and website." />
        <link rel="canonical" href="https://wallzywallet.com/tos" />
      </Helmet>
      <Navbar />

      <main className="container mx-auto px-6 py-24 max-w-3xl">
        <h1 className="text-4xl font-black text-primary mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: March 12, 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-foreground">

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Wallzy's website (wallzywallet.com) or mobile application (collectively, the "Service"),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wallzy is a credit card rewards optimization tool. It helps users identify which credit card in their
              wallet earns the best rewards at a given merchant, based on publicly available rewards program information.
              Wallzy does not provide financial advice, and its recommendations should not be construed as such.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">3. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old to use the Service. By using Wallzy, you represent and warrant that
              you meet this requirement. Wallzy is intended for use by residents of the United States.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">4. Your Account</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you join our waitlist or create an account, you agree to provide accurate information and to keep
              that information up to date. You are responsible for maintaining the confidentiality of any account
              credentials and for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">5. No Financial Advice</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wallzy provides general information about credit card rewards programs for informational purposes only.
              Nothing on the Service constitutes financial, investment, legal, or tax advice. Wallzy is not a
              registered financial advisor. You should consult a qualified financial professional before making any
              financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">6. Accuracy of Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wallzy strives to keep credit card rewards data accurate and up to date, but we make no warranties
              about the completeness, accuracy, or timeliness of this information. Rewards programs are subject to
              change by card issuers at any time. Always verify rewards rates directly with your card issuer before
              making a purchase decision based on Wallzy's recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">7. Prohibited Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Scrape, copy, or republish Wallzy's data or content without written permission</li>
              <li>Interfere with or disrupt the Service or its servers</li>
              <li>Use the Service to transmit spam or unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on the Service — including the Wallzy name, logo, design, copy, and data — is the property
              of Wallzy and protected by applicable intellectual property laws. You may not reproduce, distribute, or
              create derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or
              implied. Wallzy does not warrant that the Service will be uninterrupted, error-free, or free of
              harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">10. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Wallzy and its founders, employees, and affiliates shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages arising from your
              use of (or inability to use) the Service, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">11. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update these Terms of Service at any time. We will indicate the date of the
              most recent update at the top of this page. Continued use of the Service after any changes constitutes
              your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States and
              the state in which Wallzy operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">13. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Reach us at{" "}
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

export default TermsOfService;
