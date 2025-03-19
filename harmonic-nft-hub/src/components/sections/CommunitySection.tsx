import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import monkey from "../../assets/monkey.png";

const CommunitySection = () => {
  return (
    <section className="page-section relative overflow-hidden" id="community">
      <div className="absolute top-1/2 right-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] -translate-y-1/2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="heading-lg text-white mb-8">Join Our Community</h2>
          <p className="body-lg text-gray-300 mb-10 max-w-xl">
            Connect with other music NFT collectors, artists, and enthusiasts.
            Be part of the future of music ownership.
          </p>
          <Button
            className="bg-neon-green hover:bg-neon-green/90 text-black group"
            size="lg"
            asChild
          >
            <Link
              to="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <div className="w-full aspect-square max-w-md mx-auto relative">
            <img
              src={monkey}
              alt="3D Music NFT Visualization"
              className="nft-visual"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
