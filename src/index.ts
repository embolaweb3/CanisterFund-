import {
  query,
  update,
  Principal,
  IDL,
  msgCaller,
  time
} from "azle";
import { v4 as uuidv4 } from "uuid";

// ========== MANUALLY DEFINED TYPES ==========
type CampaignStatus = 
  | { Active: string }
  | { Completed: string }
  | { Cancelled: string };

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: bigint;
  currentAmount: bigint;
  beneficiary: Principal;
  status: string;
  creationDate: bigint;
  endDate: bigint;
}

interface CampaignContribution {
  campaignId: string;
  contributor: Principal;
  amount: bigint;
  timestamp: bigint;
}

interface UserProfile {
  principal: Principal;
  name: string;
  balance: bigint;
}

// ========== IDL DEFINITIONS ==========
const CampaignStatusIDL = IDL.Variant({
  Active: IDL.Text,
  Completed: IDL.Text,
  Cancelled: IDL.Text,
});

const CampaignIDL = IDL.Record({
  id: IDL.Text,
  title: IDL.Text,
  description: IDL.Text,
  targetAmount: IDL.Nat64,
  currentAmount: IDL.Nat64,
  beneficiary: IDL.Principal,
  status: IDL.Text,
  creationDate: IDL.Nat64,
  endDate: IDL.Nat64,
});

const CampaignContributionIDL = IDL.Record({
  campaignId: IDL.Text,
  contributor: IDL.Principal,
  amount: IDL.Nat64,
  timestamp: IDL.Nat64,
});

const UserProfileIDL = IDL.Record({
  principal: IDL.Principal,
  name: IDL.Text,
  balance: IDL.Nat64,
});

// ========== STORAGE ==========
let campaigns: Campaign[] = [];
let contributions: CampaignContribution[] = [];
let userProfiles: UserProfile[] = [];

export default class CanisterFund{
  // ========== USER MANAGEMENT ==========
  @update([IDL.Text, IDL.Nat64], IDL.Text)
  registerUser(name: string, initialBalance: bigint): string {
    const userPrincipal = msgCaller();
    
    if (userProfiles.some(u => u.principal.toText() === userPrincipal.toText())) {
      return "User already registered";
    }

    const newUser: UserProfile = {
      principal: userPrincipal,
      name,
      balance: initialBalance
    };
    userProfiles.push(newUser);
    return `User ${name} registered successfully`;
  }

  // ========== CAMPAIGN MANAGEMENT ==========
  @update([IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat64],IDL.Nat64)
  createCampaign(
    title: string,
    description: string,
    targetAmount: bigint,
    endDate: bigint
  ): string{
    if (!userProfiles.some(u => u.principal.toText() === msgCaller().toText())) {
      return "User not registered";
    }

    const newCampaign: Campaign = {
      id: uuidv4(),
      title,
      description,
      targetAmount,
      currentAmount: 0n,
      beneficiary: msgCaller(),
      status: "Active",
      creationDate: time(),
      endDate
    };
    campaigns.push(newCampaign);
    return newCampaign.id;
  }

  @update([IDL.Text,IDL.Text,IDL.Text, IDL.Nat64, IDL.Nat64], IDL.Text)
  updateCampaign(
    campaignId: string,
    title: string,
    description: string,
    targetAmount: bigint,
    endDate: bigint
  ): string{
    const campaign = campaigns.find(c => c.id.toString() === campaignId.toString());
    if (!campaign) return "Campaign not found";
    
    if (campaign.status !== "ACTIVE") {
      return "Only active campaigns can be updated";
    }

    campaign.title = title;
    campaign.description = description;
    campaign.targetAmount = targetAmount;
    campaign.endDate = endDate;

    return "Campaign updated successfully";
  }

  @update([IDL.Text, IDL.Nat64], IDL.Nat64)
  contributeToCampaign(campaignId: string, amount: bigint): string {
    const user = userProfiles.find(u => u.principal.toText() === msgCaller().toText());
    if (!user) return "User not found";

    const campaign = campaigns.find(c => c.id.toString() === campaignId.toString());
    if (!campaign) return "Campaign not found";

    if (campaign.status !== "Active") {
      return "Campaign is not active";
    }

    if (user.balance < amount) {
      return "Insufficient balance";
    }

    // Update campaign
    campaign.currentAmount += amount;

    // Record contribution
    contributions.push({
      campaignId,
      contributor: msgCaller(),
      amount,
      timestamp: time()
    });

    // Update user balance
    user.balance -= amount;

    return `Successfully contributed ${amount} to campaign ${campaignId}`;
  }

  @update([IDL.Text],IDL.Text)
  closeCampaign(campaignId: string): string {
    const campaign = campaigns.find(c => c.id.toString() === campaignId.toString());
    if (!campaign) return "Campaign not found";

    if (campaign.status !== "ACTIVE") {
      return "Only active campaigns can be closed";
    }

    // Determine final status
    campaign.status = campaign.currentAmount >= campaign.targetAmount 
      ? "COMPLETED" 
      : "CANCELLED";


    return `Campaign marked as ${campaign.status}`;
  }

  // ========== QUERY METHODS ==========
  @query([], IDL.Vec(CampaignIDL))
  getCampaigns(): Campaign[] {
    return campaigns;
  }

  @query([IDL.Text], IDL.Vec(CampaignContributionIDL))
  getCampaignContributions(campaignId: string): CampaignContribution[] {
    return contributions.filter(c => c.campaignId === campaignId);
  }

  getCampaignStatistics(campaignId: string): {
    totalAmountRaised: bigint;
    numberOfContributors: bigint;
    averageContribution: bigint;
  } {
    const campaignContributions = contributions.filter(c => c.campaignId === campaignId);
    const total = campaignContributions.reduce((sum, c) => sum + c.amount, 0n);
    const count = BigInt(campaignContributions.length);
    const average = count > 0n ? total / count : 0n;

    return {
      totalAmountRaised: total,
      numberOfContributors: count,
      averageContribution: average
    };
  }

  // TODOS : searchcampaign,updatecampaign,closecampaign

  // ========== UTILITY METHODS ==========
  @query([], IDL.Nat64)
  getTotalCampaigns(): bigint {
    return BigInt(campaigns.length);
  }
}

