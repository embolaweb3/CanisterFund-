import {
  query,
  update,
  Principal,
  IDL,
  msgCaller
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
  status: CampaignStatus;
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
  status: CampaignStatusIDL,
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


