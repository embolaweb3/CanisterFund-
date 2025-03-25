export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'closeCampaign' : IDL.Func([IDL.Text], [IDL.Text], []),
    'contributeToCampaign' : IDL.Func([IDL.Text, IDL.Nat64], [IDL.Nat64], []),
    'createCampaign' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat64, IDL.Nat64],
        [IDL.Text],
        [],
      ),
    'getCampaignContributions' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'campaignId' : IDL.Text,
              'timestamp' : IDL.Nat64,
              'amount' : IDL.Nat64,
              'contributor' : IDL.Principal,
            })
          ),
        ],
        ['query'],
      ),
    'getCampaigns' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'status' : IDL.Text,
              'title' : IDL.Text,
              'endDate' : IDL.Nat64,
              'beneficiary' : IDL.Principal,
              'description' : IDL.Text,
              'creationDate' : IDL.Nat64,
              'targetAmount' : IDL.Nat64,
              'currentAmount' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'getTotalCampaigns' : IDL.Func([], [IDL.Nat64], ['query']),
    'registerUser' : IDL.Func([IDL.Text, IDL.Nat64], [IDL.Text], []),
    'searchCampaigns' : IDL.Func(
        [IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'status' : IDL.Text,
              'title' : IDL.Text,
              'endDate' : IDL.Nat64,
              'beneficiary' : IDL.Principal,
              'description' : IDL.Text,
              'creationDate' : IDL.Nat64,
              'targetAmount' : IDL.Nat64,
              'currentAmount' : IDL.Nat64,
            })
          ),
        ],
        ['query'],
      ),
    'updateCampaign' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat64, IDL.Nat64],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
