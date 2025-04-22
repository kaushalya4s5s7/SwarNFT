import { Link } from "react-router-dom";
import { Twitter, Github } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 mt-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center">
                <div className="h-10 w-10 rounded-full border border-neon-green flex items-center justify-center mr-2">
                  <div className="h-3 w-3 rounded-full bg-neon-green"></div>
                </div>
                <span className="text-xl font-bold text-white">SwarNFT</span>
              </Link>

              <p className="mt-4 text-gray-400 max-w-md">
                SwarNFT is a decentralized platform for music NFTs, empowering
                artists and listeners through blockchain technology.
              </p>

              <div className="flex space-x-4 mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/10 text-gray-400 hover:text-neon-green"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/10 text-gray-400 hover:text-neon-green"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-white/10 text-gray-400 hover:text-neon-green"
                >
                  <FaDiscord className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-8 p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hidden md:block">
                <p className="text-sm text-gray-300">Join our newsletter</p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-black/30 border border-white/10 rounded-l-md px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-green/50"
                  />
                  <Button className="rounded-l-none bg-neon-green text-black hover:bg-neon-green/90">
                    Subscribe
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-medium mb-4 inline-block pb-1 border-b border-neon-green/30">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/trending"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  to="/collection"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/whitepaper"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Whitepaper
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-medium mb-4 inline-block pb-1 border-b border-neon-green/30">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/copyright"
                  className="text-gray-400 hover:text-neon-green transition-colors flex items-center"
                >
                  <span className="w-1 h-1 bg-neon-green/70 rounded-full mr-2"></span>
                  Copyright
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter for mobile */}
        <div className="mt-8 p-4 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm md:hidden">
          <p className="text-sm text-gray-300">Join our newsletter</p>
          <div className="flex mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-black/30 border border-white/10 rounded-l-md px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-green/50"
            />
            <Button className="rounded-l-none bg-neon-green text-black hover:bg-neon-green/90 text-sm px-3">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SwarNFT. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="h-2 w-2 rounded-full bg-neon-green/70 animate-pulse mr-2"></div>
            <p className="text-gray-400 text-sm">
              Built with ❤️ for music and blockchain
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
