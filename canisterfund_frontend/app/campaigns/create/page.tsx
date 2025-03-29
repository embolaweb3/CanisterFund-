"use client"
import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {createActor} from '../../utils/crowdfunding'

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    durationDays: '30',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {  principal } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const actor = await createActor()
    if (!principal || !actor) return;

    setIsSubmitting(true);
    try {
      const actor = await createActor()
      const endDate = BigInt(Date.now() + Number(formData.durationDays) * 24 * 60 * 60 * 1000) * BigInt(1000000);
      const targetAmount = BigInt(Number(formData.targetAmount) * 100000000);      
        const result = await actor.createCampaign(
        formData.title,
        formData.description,
        targetAmount,
        endDate,
        BigInt(0) // currentAmount starts at 0
      );

      console.log(result,'rsults')
      // const tests = await bounce.getCampaigns()
      // console.log(tests,'tests')
      toast.success('Campaign created successfully!');
      router.push('/campaigns');
    } catch (error) {
      toast.error(`Failed to create campaign: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create a New Campaign</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ic-blue focus:border-ic-blue sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ic-blue focus:border-ic-blue sm:text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                    Target Amount (ICP)
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    id="targetAmount"
                    min="1"
                    step="0.01"
                    required
                    value={formData.targetAmount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ic-blue focus:border-ic-blue sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    name="durationDays"
                    id="durationDays"
                    min="1"
                    max="365"
                    required
                    value={formData.durationDays}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ic-blue focus:border-ic-blue sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/campaigns')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ic-blue"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 bg-blue-500 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ic-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}