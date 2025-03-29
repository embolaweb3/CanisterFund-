import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { createActor } from '../utils/crowdfunding';

interface ContributionFormProps {
  campaignId: string;
}

export default function ContributionForm({ campaignId }: ContributionFormProps) {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    setIsSubmitting(true);
    try {
          const actor = await createActor()
       await actor.contributeToCampaign(campaignId, BigInt(Number(amount) * 100000000));
      toast.success('Contribution successful!');
      setAmount('');
      // Optionally refresh campaign data
    } catch (error) {
      toast.error(`Contribution failed: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Support this campaign</h3>
      <div className="flex rounded-md shadow-sm">
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="focus:ring-ic-blue focus:border-ic-blue flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
          placeholder="Amount in ICP"
        />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
          ICP
        </span>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !amount}
        className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ic-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : 'Contribute'}
      </button>
    </form>
  );
}