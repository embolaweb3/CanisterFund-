import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'closeCampaign' : ActorMethod<[string], string>,
  'contributeToCampaign' : ActorMethod<[string, bigint], string>,
  'createCampaign' : ActorMethod<
    [string, string, bigint, bigint, bigint],
    string
  >,
  'getCampaignContributions' : ActorMethod<
    [string],
    Array<
      {
        'campaignId' : string,
        'timestamp' : bigint,
        'amount' : bigint,
        'contributor' : Principal,
      }
    >
  >,
  'getCampaigns' : ActorMethod<
    [],
    Array<
      {
        'id' : string,
        'status' : string,
        'title' : string,
        'endDate' : bigint,
        'beneficiary' : Principal,
        'description' : string,
        'creationDate' : bigint,
        'targetAmount' : bigint,
        'currentAmount' : bigint,
      }
    >
  >,
  'getTotalCampaigns' : ActorMethod<[], bigint>,
  'registerUser' : ActorMethod<[string, bigint], string>,
  'searchCampaigns' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'status' : string,
        'title' : string,
        'endDate' : bigint,
        'beneficiary' : Principal,
        'description' : string,
        'creationDate' : bigint,
        'targetAmount' : bigint,
        'currentAmount' : bigint,
      }
    >
  >,
  'updateCampaign' : ActorMethod<
    [string, string, string, bigint, bigint],
    string
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
