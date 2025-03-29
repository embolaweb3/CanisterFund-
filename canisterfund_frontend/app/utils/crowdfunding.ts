import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from './canisterfund.did.js';
import type { _SERVICE } from './canisterfund.did';

export const canisterId = 'tyytm-wqaaa-aaaap-qpyka-cai'; 

export const createActor = async (options?: { authClient?: AuthClient }) => {
  const agent =  new HttpAgent({ host: 'https://ic0.app' });

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
  });
};