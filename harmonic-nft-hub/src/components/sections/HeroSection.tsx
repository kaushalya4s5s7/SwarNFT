import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import musicNftSvg from "../../assets/MusicNFTElement.svg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen mt-12 flex flex-col justify-center items-center">
      {/* Single Hero Container */}
      <div className="hero-container relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16 py-16 md:py-24 bg-black border border-neon-green shadow-neon rounded-2xl overflow-hidden">
        {/* Four SVGs placed only once */}
        <img src={musicNftSvg} alt="SVG" className="hero-svg top-left" />
        <img src={musicNftSvg} alt="SVG" className="hero-svg top-right" />
        {/* <img src={musicNftSvg} alt="SVG" className="hero-svg bottom-left" /> */}
        <img src={musicNftSvg} alt="SVG" className="hero-svg bottom-right" />

        {/* Hero Content */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="heading-xl text-white mb-6 mt-8">
                <span className="block">SwarNFT</span>
                <span className="block">Music</span>
                <span className="block text-yellow-300 text-glow">NFTs</span>
                <span className="block">Collection</span>
              </h1>

              <p className="body-lg text-gray-300 mb-8 max-w-xl">
                Collect exclusive music NFTs from top artists, join our
                community, unlock opportunities.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/trending">
                  <Button
                    size="lg"
                    className="bg-neon-green hover:bg-neon-green/90 text-black group"
                  >
                    DISCOVER
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full relative overflow-hidden">
                <Spline scene="https://prod.spline.design/eAF45ovGVJ242n-Y/scene.splinecode" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
