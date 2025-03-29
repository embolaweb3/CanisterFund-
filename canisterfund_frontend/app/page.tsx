"use client"
import Layout from './components/Layout';
import Link from 'next/link';
import { useAuth } from './hooks/useAuth';
import { motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="relative bg-ic-dark overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-ic-dark sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold  text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Fund ideas that</span>
                  <span className="block text-ic-blue">change the world</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A decentralized crowdfunding platform on the Internet Computer. Support projects you believe in or launch your own.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/campaigns"
                     className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-ic-blue hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                       Explore Campaigns
                    </Link>
                  </div>
                  {isAuthenticated && (
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-ic-blue bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                      href="/campaigns/create">
                         Start a Campaign
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-gray-900 text-ic-blue font-extrabold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-semibold tracking-tight text-gray-600 sm:text-4xl">
              A better way to crowdfund
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Decentralized',
                  description: 'Built on the Internet Computer, your campaigns and contributions are secure and tamper-proof.',
                },
                {
                  name: 'Transparent',
                  description: 'All contributions are recorded on-chain and visible to everyone.',
                },
                {
                  name: 'Global',
                  description: 'Anyone in the world can participate without intermediaries or borders.',
                },
              ].map((feature) => (
                <motion.div 
                  key={feature.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}