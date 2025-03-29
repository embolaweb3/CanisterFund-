import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from './canisterfund.did.js';
import type { _SERVICE } from './canisterfund.did';

export const canisterId = 'tyytm-wqaaa-aaaap-qpyka-cai'; 

let authClient :any;

export const init = async () => {
  authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true,
    },
  });
  return authClient;
};
export const createActor = async (options?: { authClient?: AuthClient }) => {
  if (!authClient) {
    await init();
  }
  const identity = authClient.getIdentity()
  const agent =  new HttpAgent({ host: 'https://ic0.app',
    identity
   });

  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
};