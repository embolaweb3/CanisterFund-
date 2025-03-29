import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import CampaignCard from '../components/CampaignCard';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function CampaignsPage() {
  const { actor } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: campaigns, 
    isLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ['campaigns', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      try {
        return searchTerm 
          ? await actor.searchCampaigns(searchTerm)
          : await actor.getCampaigns();
      } catch (err) {
        throw new Error(`Failed to fetch campaigns: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    enabled: !!actor,
    staleTime: 60_000, // 1 minute before data becomes stale
  });

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">All Campaigns</h1>
            <p className="mt-2 text-sm text-gray-700">
              Support projects that matter to you
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-ic-blue focus:border-ic-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ic-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Error icon */}
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading campaigns: {(error as Error).message}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns?.map((campaign :any) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}