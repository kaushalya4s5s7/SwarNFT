
import { motion } from 'framer-motion';
import { Wallet, Music, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: <Wallet className="h-8 w-8 text-neon-green" />,
    title: 'Connect Wallet',
    description: 'Link your crypto wallet to start collecting music NFTs',
  },
  {
    icon: <Music className="h-8 w-8 text-neon-green" />,
    title: 'Choose Your Music',
    description: 'Browse exclusive tracks from top artists',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-neon-green" />,
    title: 'Make Your Bid',
    description: 'Place bids on your favorite music NFTs',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorksSection = () => {
  return (
    <section className="page-section" id="how-it-works">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="heading-lg text-white">How It Works</h2>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={item}
            className="neo-blur p-8 flex flex-col items-start"
          >
            <div className="p-3 bg-black/40 rounded-lg mb-5 border border-neon-green/20">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
