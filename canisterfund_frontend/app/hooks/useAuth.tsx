"use client"

import { useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../utils/crowdfunding';
import { Principal } from '@dfinity/principal';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState<AuthClient>();
  const [principal, setPrincipal] = useState<Principal>();
  const [actor, setActor] = useState<any>();
  const [isRegistered, setIsRegistered] = useState(false);

  const checkRegistration = async (actor: any, principal: Principal) => {
    try {
      // Assuming you have a canister method to check registration
      const response = await actor.checkUserRegistration(principal.toString());
      setIsRegistered(response);
      return response;
    } catch (error) {
      console.error("Registration check failed:", error);
      return false;
    }
  };

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      if (await client.isAuthenticated()) {
        setIsAuthenticated(true);
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal());
        setActor(createActor({ authClient: client }));
      }
    });
  }, []);

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
        setActor(createActor({ authClient }));
      },
    });
  }, [authClient]);

  const logout = useCallback(async () => {
    if (!authClient) return;
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(undefined);
    setActor(undefined);
  }, [authClient]);

  
  return {
    isAuthenticated,
    login,
    logout,
    principal,
    actor,
  };
};