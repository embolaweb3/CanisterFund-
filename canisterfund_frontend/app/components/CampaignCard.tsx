import { motion } from 'framer-motion';
import Link from 'next/link';
import { Campaign } from '../types';
import ProgressBar from './ProgressBar';
const { formatDistanceToNow } = require('date-fns');

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (Number(campaign.currentAmount) / Number(campaign.targetAmount)) * 100;
  const endDate = new Date(Number(campaign.endDate) / 1000000);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {campaign.status}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(Number(campaign.creationDate) / 1000000), { addSuffix: true })}
          </span>
        </div>
        
        <p className="mt-3 text-gray-600 line-clamp-2">{campaign.description}</p>
        
        <div className="mt-4">
          <ProgressBar progress={progress} />
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Raised: {Number(campaign.currentAmount).toLocaleString()} ICP</span>
            <span>Goal: {Number(campaign.targetAmount).toLocaleString()} ICP</span>
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            Ends {formatDistanceToNow(endDate, { addSuffix: true })}
          </div>
        </div>
        
        <div className="mt-6">
          <Link href={`/campaigns/${campaign.id}`}>
            <a className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ic-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View Details
            </a>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}