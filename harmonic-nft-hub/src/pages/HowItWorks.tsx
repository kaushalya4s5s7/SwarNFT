import { motion } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  Music,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MusicPlayer from "@/components/ui/MusicPlayer";

const HowItWorks = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container pt-24"
    >
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16 pt-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-lg text-white"
          >
            How It Works
          </motion.h1>
        </header>

        <div className="space-y-24">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <div className="neo-blur p-8 flex flex-col items-start order-2 md:order-1">
              <div className="p-4 bg-black/40 rounded-lg mb-5 border border-neon-green/20">
                <Wallet className="h-10 w-10 text-neon-green" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Step 1: Connect Wallet
              </h2>
              <p className="text-gray-400 mb-6">
                Link your crypto wallet to start your journey. We support
                MetaMask, WalletConnect, and other popular providers. Your
                wallet serves as your identity and allows you to buy, sell, and
                trade music NFTs on our platform.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Secure authentication through blockchain technology
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Your wallet address maps to your role (artist or listener)
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Switch networks seamlessly for different blockchain support
                  </span>
                </li>
              </ul>
              <Button
                className="bg-neon-green hover:bg-neon-green/90 text-black"
                size="lg"
              >
                Connect Wallet
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="glass-card p-6 relative overflow-hidden aspect-square">
                <img
                  src="public/lovable-uploads/48ef3d34-afe7-4411-97f5-a44fa963a2a3.png"
                  alt="Connect Wallet Illustration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <div className="glass-card p-6 relative overflow-hidden aspect-square">
              <img
                src="public/lovable-uploads/d56bcc93-ae76-4513-9bd9-d789c36a8b79.png"
                alt="Choose Music Illustration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="neo-blur p-8 flex flex-col items-start">
              <div className="p-4 bg-black/40 rounded-lg mb-5 border border-neon-green/20">
                <Music className="h-10 w-10 text-neon-green" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Step 2: Choose Your Music
              </h2>
              <p className="text-gray-400 mb-6">
                Browse our exclusive collection of music NFTs from emerging and
                established artists. Each track is a unique digital asset that
                can be owned, traded, and collected. Pre-authenticated users can
                listen to samples, while authenticated users get full access.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    High-quality audio files verified on the blockchain
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Detailed information about the artist and creation process
                  </span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ownership history and provenance tracking</span>
                </li>
              </ul>
              <Link to="/trending">
                <Button
                  className="bg-neon-green hover:bg-neon-green/90 text-black"
                  size="lg"
                >
                  Browse Collection
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <div className="neo-blur p-8 flex flex-col items-start order-2 md:order-1">
              <div className="p-4 bg-black/40 rounded-lg mb-5 border border-neon-green/20">
                <TrendingUp className="h-10 w-10 text-neon-green" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Step 3: Make Your Bid
              </h2>
              <p className="text-gray-400 mb-6">
                Found something you love? Place bids on your favorite music NFTs
                or buy fractional ownership directly. Our platform supports both
                full ownership and shared ownership models, allowing more fans
                to participate in the music economy.
              </p>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Fractional ownership starting from 0.001 ETH</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transparent bid history and current valuations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-5 w-5 text-neon-green mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Automatic royalty distributions to artists and co-owners
                  </span>
                </li>
              </ul>
              <Link to="/collection">
                <Button
                  className="bg-neon-green hover:bg-neon-green/90 text-black"
                  size="lg"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="glass-card p-6 relative overflow-hidden aspect-square">
                <img
                  src="public/lovable-uploads/8c7e7287-0697-4c84-9b2f-9a9b2df0de1c.png"
                  alt="Make Bid Illustration"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-24 mb-16">
          <h2 className="heading-md text-white mb-10 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="h-12 w-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Role-Based Access
              </h3>
              <p className="text-gray-400">
                Choose between listener and artist roles, each with unique
                capabilities and dashboard experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="h-12 w-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Secure Ownership
              </h3>
              <p className="text-gray-400">
                All transactions and ownership records are secured on the
                blockchain for maximum transparency.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="h-12 w-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-neon-green" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Royalty Distribution
              </h3>
              <p className="text-gray-400">
                Automated royalty payments to artists and fractional owners when
                NFTs are sold or streamed.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Ready to get started?
          </h2>
          <Link to="/">
            <Button
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              size="lg"
            >
              Join SwarNFT Today
            </Button>
          </Link>
        </div>
      </div>

      <MusicPlayer />
    </motion.div>
  );
};

export default HowItWorks;
