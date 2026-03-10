import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const toolsRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Product", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "FAQ", href: "#faq" },
  ];

  const toolLinks = [
    { name: "Rewards Calculator", to: "/byw" },
    { name: "Card Comparison Tool", to: "/compare" },
  ];

  const isToolActive = ["/byw", "/compare"].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "how-it-works", "about", "faq"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    const sectionId = href.substring(1);
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
    setIsOpen(false);
  };

  const handleWaitlistClick = () => {
    if (isHome) {
      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#waitlist");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <a
            href="/#home"
            className="flex items-center gap-0 text-2xl font-black text-white tracking-tight -ml-6"
          >
            <img src={logo} alt="Wallzy" className="h-16 w-16 -mr-6" />
            allzy
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-14">
            {navLinks.map((link) => {
              const sectionId = link.href.substring(1);
              const isActive = isHome && activeSection === sectionId;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-white/90 hover:text-white font-medium text-md tracking-wide border-b-2 transition-all ${
                    isActive ? "border-white text-white" : "border-transparent"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}

            {/* Financial Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-white/90 hover:text-white font-medium text-md tracking-wide border-b-2 transition-all ${
                  isToolActive ? "border-white text-white" : "border-transparent"
                }`}
              >
                Financial Tools
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-primary border border-white/15 rounded-xl shadow-xl overflow-hidden">
                  {toolLinks.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={() => setToolsOpen(false)}
                      className={`block px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10 ${
                        location.pathname === tool.to
                          ? "text-white bg-white/10"
                          : "text-white/80"
                      }`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6 py-2 text-sm rounded-lg"
              onClick={handleWaitlistClick}
            >
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 bg-primary z-40 transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: "4.5rem" }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-white text-2xl font-medium hover:text-secondary transition-colors"
              >
                {link.name}
              </button>
            ))}

            {/* Mobile Financial Tools */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => setMobileToolsOpen((prev) => !prev)}
                className="flex items-center gap-1 text-white text-2xl font-medium hover:text-secondary transition-colors"
              >
                Financial Tools
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-200 ${mobileToolsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileToolsOpen && (
                <div className="flex flex-col items-center gap-4">
                  {toolLinks.map((tool) => (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      className="text-white/80 text-xl font-medium hover:text-secondary transition-colors"
                      onClick={() => { setIsOpen(false); setMobileToolsOpen(false); }}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleWaitlistClick}
              className="text-white text-2xl font-medium hover:text-secondary transition-colors"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
