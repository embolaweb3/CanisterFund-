import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>IC Crowdfunding Platform</title>
        <meta name="description" content="Decentralized crowdfunding on the Internet Computer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-ic-dark text-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center ">
              <Link href="/" className="text-xl font-bold text-ic-blue">
              Canister Fund
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-4">
                  <Link href="/campaigns" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ic-blue hover:bg-opacity-20">
                  Campaigns
                  </Link>
                  {isAuthenticated && (
                    <Link href="/my-campaigns" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-ic-blue hover:bg-opacity-20">
                      My Campaigns
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm truncate max-w-xs">
                    {principal?.toString()}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="px-4 py-2 bg-ic-blue bg-blue-600 text-white rounded-md hover:bg-blue-400 transition"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}