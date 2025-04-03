import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import WalletConnectButton from "@/components/ui/WalletConnectButton";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

  const navLinks = [
    { name: "How It Works", path: "/how-it-works" },
    { name: "Trending", path: "/trending" },
    { name: "Collection", path: "/collection" },
    { name: "Community", path: "/community" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-8 lg:px-12 py-4 transition-all duration-300 ${
        scrolled ? "backdrop-blur-lg bg-black/70" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="h-10 w-10 rounded-full border border-neon-green flex items-center justify-center mr-2">
            <div className="h-3 w-3 rounded-full bg-neon-green animate-pulse-neon"></div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-neon-green ${
                location.pathname === link.path
                  ? "text-neon-green"
                  : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/whitepaper">
            <Button
              variant="outline"
              className="border-gray-700 hover:border-neon-green text-white hover:text-neon-green transition-all"
            >
              Whitepaper
            </Button>
          </Link>

          <WalletConnectButton />

          {isAuthenticated && (
            <Link
              to={
                role === "artist" ? "/artist-dashboard" : "/listener-dashboard"
              }
            >
              <Button
                variant="ghost"
                className="text-white hover:text-neon-green"
              >
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
