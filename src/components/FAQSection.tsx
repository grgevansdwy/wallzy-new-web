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
      "An app that suggests the best credit card for you to use through a simple notification. We help you get the most rewards every time you shop.",
  },
  {
    question: "How does Wallzy work?",
    answer:
      "Wallzy sends you a silent notification. It recommends which credit card in your wallet gives you the best rewards or deals at that specific store.",
  },
  {
    question: "Is Wallzy safe, and can it hurt my credit score?",
    answer:
      "Wallzy is safe and won't hurt your credit score because we don't link your accounts. You simply tell us which credit cards you own so we can remind you about payments and help you earn more rewards.",
  },
  {
    question: "How is Wallzy different from other recommendation apps?",
    answer:
      "Wallzy has no affiliation with banks and will always be on your side. We also adopt set once, forget it approach so you never have to open the app again.",
  },
  {
    question: "How can I get early access to Wallzy?",
    answer:
      "You can join our waitlist through our website. We're currently in the beta phase, testing with early users and continuously improving the product based on their feedback.",
  },
  {
    question: "Is Wallzy free to use?",
    answer: "Yes, it is completely free to use.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-primary mb-16">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl px-6 border border-border shadow-sm"
              >
                <AccordionTrigger className="text-left text-primary font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
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
