import logo from "@/assets/logo.png";
import mailIcon from "@/assets/mail.svg";
import instagramIcon from "@/assets/instagram.svg";
import tiktokIcon from "@/assets/tiktok.svg";

const Footer = () => {
  return (
    <footer className="bg-primary py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Logo + Slogan */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-4xl font-bold text-primary-foreground flex items-center gap-2 order-1 mb-0">
              <img
                src={logo}
                alt="Wallzy"
                className="h-28 w-28 md:h-36 md:w-36 -mr-12 md:-mr-14 -ml-4 md:-ml-8"
              />
              allzy
            </h3>
            <p className="text-primary-foreground max-w-xs font-bold text-base sm:text-lg md:text-xl order-2 ml-0 md:ml-4 -mt-5">
              Stop Guessing, <br /> Start{" "}
              <span className="text-secondary"> Earning.</span>
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-2xl font-extrabold text-primary-foreground mb-4 pb-3 border-b-2 border-primary-foreground/30 w-32">
              Contact Us
            </h4>
            <ul className="space-y-3 text-primary-foreground/80 font-semibold">
              <li>
                <a
                  href="mailto:wallzywallet@gmail.com"
                  className="hover:text-primary-foreground transition-colors flex items-center gap-2 justify-center md:justify-start"
                >
                  <img
                    src={mailIcon}
                    alt="Email"
                    className="w-5 h-5"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(68%) sepia(8%) saturate(389%) hue-rotate(204deg)",
                    }}
                  />
                  wallzywallet@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/wallzywallet"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-foreground transition-colors flex items-center gap-2 justify-center md:justify-start"
                >
                  <img
                    src={instagramIcon}
                    alt="Instagram"
                    className="w-5 h-5"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(68%) sepia(8%) saturate(389%) hue-rotate(204deg)",
                    }}
                  />
                  @wallzywallet
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@wallzywallet"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-foreground transition-colors flex items-center gap-2 justify-center md:justify-start"
                >
                  <img
                    src={tiktokIcon}
                    alt="TikTok"
                    className="w-5 h-5"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(68%) sepia(8%) saturate(389%) hue-rotate(204deg)",
                    }}
                  />
                  @wallzywallet
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-2xl font-bold text-primary-foreground mb-4 pb-3 border-b-2 border-primary-foreground/30 w-36">
              Quick Links
            </h4>
            <ul className="space-y-2 font-semibold">
              <li>
                <a
                  href="#home"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/60 text-sm font-bold">
            © {new Date().getFullYear()} Wallzy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
