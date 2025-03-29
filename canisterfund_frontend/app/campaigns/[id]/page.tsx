import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import ProgressBar from '../../components/ProgressBar';
import ContributionForm from '../../components/ContributionForm';
import ContributionsList from '../../components/ContributionsList';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
const { formatDistanceToNow } = require('date-fns');


export default function CampaignDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { actor, isAuthenticated, principal } = useAuth();

  const { data: campaign } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const campaigns = await actor!.getCampaigns();
      return campaigns.find((c :any) => c.id === id);
    },
    enabled: !!actor && !!id,
  });

  const { data: contributions = [], error } = useQuery({
    queryKey: ['contributions', id],
    queryFn: () => actor!.getCampaignContributions(id),
    enabled: !!actor && !!id,
  });
  
  if (error) {
    console.error('Failed to load contributions:', error);
  }

  if (!campaign) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ic-blue"></div>
        </div>
      </Layout>
    );
  }

  const isOwner = principal?.toString() === campaign.beneficiary.toString();
  const progress = (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100;
  const endDate = new Date(Number(campaign.endDate) / 1000000);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-ic-blue hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to campaigns
        </button>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Created by: {campaign.beneficiary.toString()}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </span>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-700 mb-6">{campaign.description}</p>
            
            <div className="mb-6">
              <ProgressBar progress={progress} />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Raised: {Number(campaign.currentAmount).toLocaleString()} ICP</span>
                <span>Goal: {Number(campaign.targetAmount).toLocaleString()} ICP</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDistanceToNow(new Date(Number(campaign.creationDate) / 1000000), { addSuffix: true })}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Ends</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDistanceToNow(endDate, { addSuffix: true })}
                    </dd>
                  </div>
                </dl>
              </div>
              
              {isAuthenticated && campaign.status === 'active' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ContributionForm campaignId={campaign.id} />
                </div>
              )}
            </div>
          </div>
          
          {isOwner && (
            <div className="px-4 py-4 bg-gray-50 sm:px-6 flex justify-end space-x-3">
              <button
                onClick={async () => {
                  try {
                    await actor?.closeCampaign(campaign.id);
                    // Refresh data
                  } catch (error) {
                    console.error(error);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Close Campaign
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contributions</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {contributions?.length ? (
              <ContributionsList contributions={contributions} />
            ) : (
              <p className="text-gray-500 text-center py-4">No contributions yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}