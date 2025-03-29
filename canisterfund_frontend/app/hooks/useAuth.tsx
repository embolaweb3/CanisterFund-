"use client"

import { useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/crowdfunding';
import { Principal } from '@dfinity/principal';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [principal, setPrincipal] = useState<Principal>();
  const [isRegistered, setIsRegistered] = useState(false);


  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        setIsAuthenticated(true);
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal());
         // Check registration status
         await checkRegistration();
      }

    });
  }, []);

  const checkRegistration = async () => {
    try {
      const actor = await createActor()
      const response = await actor.getUser();
      setIsRegistered(response);
      console.log(response)
      return response;
    } catch (error) {
      console.error("Registration check failed:", error);
      return false;
    }
  };

  const login = useCallback(async () => {
    if (!authClient) return;
    
    await authClient.login({
      identityProvider: process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'http://localhost:8000/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai'
        : 'https://identity.ic0.app',
      onSuccess: async () => {
        setIsAuthenticated(true);
        const identity = authClient.getIdentity();
        setPrincipal(identity.getPrincipal());
      },
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(undefined);
  }, [authClient]);

  
  return {
    isAuthenticated,
    login,
    logout,
    principal,
    isRegistered,
    registerUser: async (name: string) => {
      const actor = await createActor()
      if (!actor) throw new Error('Actor not initialized');
      try {
        const response = await actor.registerUser(name, BigInt(10));
        if(response.includes('successfully') || response.includes('already')){
          return true
        }
        else{
          return false
        }
       
        
      } catch (error) {
        console.error("Registration failed:", error);
        return false;
      }
    },
  };
};