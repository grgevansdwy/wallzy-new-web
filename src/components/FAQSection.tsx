import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Wallzy?",
    answer:
      "Wallzy is an app that sends you a simple notification recommending the best credit card to use whenever you shop. No spreadsheets, no guessing. Just the right card at the right time.",
  },
  {
    question: "How does Wallzy work?",
    answer:
      "When you're near a store, Wallzy sends you a quiet notification recommending which card in your wallet earns the best rewards there. Once you leave, the notification disappears automatically.",
  },
  {
    question: "Is Wallzy safe, and can it hurt my credit score?",
    answer:
      "Wallzy is completely safe and has no impact on your credit score. We never link to your bank accounts — you simply tell us which cards you own, and we take care of the rest.",
  },
  {
    question: "How is Wallzy different from other recommendation apps?",
    answer:
      "Wallzy has no affiliation with any bank, so our recommendations are always in your best interest. We also take a set-it-and-forget-it approach: once you're set up, you never need to open the app again.",
  },
  {
    question: "How can I get early access to Wallzy?",
    answer:
      "Join our waitlist right here on the website. We're currently in beta, working closely with early users and refining the product based on their feedback.",
  },
  {
    question: "Is Wallzy free to use?",
    answer: "Yes, Wallzy is completely free to use.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-primary">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-16" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Frequently Asked Questions.
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/10 rounded-2xl px-6 border border-white/15"
              >
                <AccordionTrigger className="text-left text-white font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
