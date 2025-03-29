export type Campaign = {
    id: string;
    status: string;
    title: string;
    endDate: bigint;
    beneficiary: any; // Principal type
    description: string;
    creationDate: bigint;
    targetAmount: bigint;
    currentAmount: bigint;
  };
  
  export type Contribution = {
    campaignId: string;
    timestamp: bigint;
    amount: bigint;
    contributor: any; // Principal type
  };