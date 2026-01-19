const Footer = () => {
  return (
    <footer className="gradient-hero py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground">
              Wallzy
            </h3>
            <p className="text-primary-foreground/70 mt-2">
              Maximize your credit card rewards at UW Seattle
            </p>
          </div>

          <div className="flex gap-8">
            <a
              href="#home"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Wallzy. Made with ❤️ by UW Students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
