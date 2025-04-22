
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Whitepaper = () => {
  const sections = useRef([
    { id: 'intro', title: 'Introduction' },
    { id: 'vision', title: 'Vision & Mission' },
    { id: 'technology', title: 'Technology' },
    { id: 'music-nfts', title: 'Music NFTs' },
    { id: 'tokenomics', title: 'Tokenomics' },
    { id: 'roadmap', title: 'Roadmap' },
    { id: 'team', title: 'Team' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-container pt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row gap-12">
          <div className="lg:w-3/4">
            <header className="mb-16 pt-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 text-neon-green mb-4">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Official Document</span>
                </div>
                <h1 className="heading-lg text-white mb-6">
                  RhythMint Whitepaper
                </h1>
                <p className="body-lg text-gray-300 max-w-3xl">
                  A comprehensive overview of RhythMint's vision, technology, and roadmap.
                  Learn how we're revolutionizing music ownership through blockchain technology.
                </p>
              
              </motion.div>
            </header>

            <section id="intro" className="mb-16">
              <h2 className="heading-md text-white mb-6">1. Introduction</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  RhythMint is a decentralized platform that leverages blockchain technology to revolutionize how music is owned, distributed, and monetized. By tokenizing music as NFTs (Non-Fungible Tokens), we create new opportunities for artists and listeners alike.
                </p>
                <p className="text-gray-300 mb-4">
                  In the traditional music industry, artists often receive only a small fraction of the revenue generated from their work, with intermediaries taking the lion's share. RhythMint aims to change this by enabling direct artist-to-fan relationships and creating new revenue streams through fractional ownership of music NFTs.
                </p>
                <p className="text-gray-300">
                  This whitepaper outlines our vision, technology, tokenomics, and roadmap for building a sustainable ecosystem that benefits all participants in the music economy.
                </p>
              </div>
            </section>

            <section id="vision" className="mb-16">
              <h2 className="heading-md text-white mb-6">2. Vision & Mission</h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-white mb-4">Vision</h3>
                <p className="text-gray-300 mb-6">
                  To create a world where music is truly owned by those who create and appreciate it, establishing a more equitable and transparent music ecosystem powered by blockchain technology.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Mission</h3>
                <p className="text-gray-300 mb-4">
                  RhythMint's mission is to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                  <li>Empower artists with direct ownership and control over their music</li>
                  <li>Provide listeners with new ways to support artists and participate in the success of their favorite music</li>
                  <li>Create a transparent, efficient marketplace for music ownership and royalties</li>
                  <li>Build community-driven governance that evolves with the needs of the ecosystem</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-4">Core Values</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li><span className="text-neon-green font-medium">Transparency:</span> All transactions, ownership, and royalty distributions are publicly verifiable on the blockchain</li>
                  <li><span className="text-neon-green font-medium">Fairness:</span> Creating equitable compensation models for all participants in the music economy</li>
                  <li><span className="text-neon-green font-medium">Innovation:</span> Continuously exploring new ways to leverage blockchain technology for music</li>
                  <li><span className="text-neon-green font-medium">Community:</span> Building a vibrant ecosystem where artists and fans can connect directly</li>
                </ul>
              </div>
            </section>

            <section id="technology" className="mb-16">
              <h2 className="heading-md text-white mb-6">3. Technology</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  RhythMint is built on a robust technology stack that ensures security, scalability, and interoperability with the broader Web3 ecosystem.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Blockchain Infrastructure</h3>
                <p className="text-gray-300 mb-6">
                  RhythMint operates primarily on the Ethereum blockchain, leveraging its security and widespread adoption. However, to address scalability concerns and transaction costs, we utilize layer-2 solutions and sidechains for optimized performance.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Smart Contracts</h3>
                <p className="text-gray-300 mb-6">
                  Our platform utilizes a suite of smart contracts that handle:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                  <li>NFT minting and ownership verification</li>
                  <li>Fractional ownership management</li>
                  <li>Automated royalty distribution</li>
                  <li>Marketplace functionality (bidding, buying, selling)</li>
                  <li>Role-based authentication and permissions</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-4">Storage Solution</h3>
                <p className="text-gray-300 mb-6">
                  Music files and metadata are stored using a combination of decentralized storage solutions, including IPFS (InterPlanetary File System) and Arweave, ensuring permanent availability and resistance to censorship.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Frontend Technology</h3>
                <p className="text-gray-300">
                  The user interface is built using React with TypeScript for type safety, Redux for state management, and ethers.js for blockchain interactions. This creates a responsive, intuitive experience across devices.
                </p>
              </div>
            </section>

            <section id="music-nfts" className="mb-16">
              <h2 className="heading-md text-white mb-6">4. Music NFTs</h2>
              {/* Content truncated for brevity */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  RhythMint's core innovation lies in our approach to music NFTs, which represent both digital ownership and rights to music assets.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">NFT Structure</h3>
                <p className="text-gray-300 mb-6">
                  Each music NFT contains:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
                  <li>High-quality audio file</li>
                  <li>Artwork and visual assets</li>
                  <li>Metadata (artist info, production details, release date)</li>
                  <li>Smart contract defining ownership rights and royalty splits</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white mb-4">Fractional Ownership Model</h3>
                <p className="text-gray-300 mb-6">
                  RhythMint introduces a fractional ownership model that allows multiple collectors to own shares of a single music NFT. This democratizes access to music investment and creates more liquidity in the marketplace.
                </p>
                
                <div className="glass-card p-6 mb-6">
                  <h4 className="text-lg font-medium text-white mb-2">Example: Fractional Ownership</h4>
                  <p className="text-gray-300 mb-2">
                    An artist releases a track as an NFT with 100 total shares:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-300">
                    <li>Artist retains 20 shares</li>
                    <li>Producer receives 10 shares</li>
                    <li>70 shares available for collectors to purchase</li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">Royalty Distribution</h3>
                <p className="text-gray-300">
                  When the NFT generates revenue (through streams, sales, or licensing), the proceeds are automatically distributed to all shareholders according to their ownership percentage, ensuring transparent and immediate compensation.
                </p>
              </div>
            </section>

            {/* Additional sections truncated for brevity */}
          </div>
          
          <div className="lg:w-1/4">
            <div className="neo-blur p-6 sticky top-32">
              <h3 className="text-lg font-medium text-white mb-4">Contents</h3>
              <nav className="space-y-2">
                {sections.current.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block py-2 px-3 text-gray-300 hover:text-neon-green hover:bg-white/5 rounded-md transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-white/10">
                <Button variant="outline" className="w-full border-white/10 hover:border-neon-green/50" asChild>
                  <Link to="/how-it-works">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Whitepaper;
