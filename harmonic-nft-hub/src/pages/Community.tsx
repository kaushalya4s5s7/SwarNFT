import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Twitter, Globe } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import MusicPlayer from '@/components/ui/MusicPlayer';

const Community = () => {
  const communityEvents = [
    {
      id: 1,
      title: 'Virtual Listening Party',
      date: 'March 15, 2023',
      description: 'Join us for a virtual listening party featuring new releases from top artists on our platform.',
      link: '#',
    },
    {
      id: 2,
      title: 'NFT Music Conference',
      date: 'April 10-12, 2023',
      description: 'A three-day conference exploring the intersection of blockchain technology and the music industry.',
      link: '#',
    },
    {
      id: 3,
      title: 'Artist AMA Session',
      date: 'March 28, 2023',
      description: 'Ask-Me-Anything session with CyberWave, the artist behind the trending "Neon Dreams" NFT.',
      link: '#',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 pt-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="heading-lg text-white"
          >
            Join Our Community
          </motion.h1>
        </header>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="heading-md text-white mb-6">Connect with Other Collectors</h2>
              <p className="body-lg text-gray-300 mb-10">
                Connect with other music NFT collectors, artists, and enthusiasts. 
                Be part of the future of music ownership. Join our Discord server 
                for exclusive access to artist AMAs, listening parties, and early 
                access to new releases.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-neon-green hover:bg-neon-green/90 text-black group"
                  size="lg"
                  asChild
                >
                  <Link to="https://discord.com" target="_blank" rel="noopener noreferrer">
                    <FaDiscord className="mr-2 h-5 w-5" />
                    Join Discord
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 hover:border-neon-green/50 group"
                  size="lg"
                  asChild
                >
                  <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-5 w-5" />
                    Follow on Twitter
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="neo-blur p-8 relative">
                <h3 className="text-xl font-medium text-white mb-6">Community Stats</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-neon-green text-4xl font-bold mb-2">12.5K+</p>
                    <p className="text-gray-400">Discord Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neon-green text-4xl font-bold mb-2">8.3K+</p>
                    <p className="text-gray-400">Twitter Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neon-green text-4xl font-bold mb-2">456</p>
                    <p className="text-gray-400">Artists</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neon-green text-4xl font-bold mb-2">2.8K+</p>
                    <p className="text-gray-400">NFT Collectors</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="heading-md text-white mb-10">Upcoming Community Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="mb-4">
                  <span className="text-xs font-medium bg-white/10 text-white px-2 py-1 rounded-full">
                    {event.date}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <Link
                  to={event.link}
                  className="inline-flex items-center text-neon-green hover:text-neon-green/80 transition-colors"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="heading-md text-white mb-10">Featured Community Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: id * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green/30 to-purple-500/30 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {String.fromCharCode(64 + id)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Community Member {id}</h3>
                <p className="text-gray-400 text-sm mb-3">
                  {id % 2 === 0 ? 'Artist' : 'Collector'}
                </p>
                <div className="flex justify-center space-x-2">
                  <a href="#" className="text-gray-400 hover:text-neon-green transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-neon-green transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="neo-blur p-10 text-center">
            <h2 className="heading-md text-white mb-6">Ready to Get Involved?</h2>
            <p className="body-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our community of music enthusiasts, artists, and collectors. 
              Connect, collaborate, and be part of the future of music.
            </p>
            <Button
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              size="lg"
              asChild
            >
              <Link to="https://discord.com" target="_blank" rel="noopener noreferrer">
                Join Our Discord
              </Link>
            </Button>
          </div>
        </section>
      </div>
      
      <MusicPlayer />
    </motion.div>
  );
};

export default Community;
