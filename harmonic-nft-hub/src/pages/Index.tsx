
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import TrendingSection from '@/components/sections/TrendingSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import CommunitySection from '@/components/sections/CommunitySection';
import MusicPlayer from '@/components/ui/MusicPlayer';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container"
    >
      <HeroSection />
      <HowItWorksSection />
      <TrendingSection />
      <CommunitySection />
      <MusicPlayer />
    </motion.div>
  );
};

export default Index;
