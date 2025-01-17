import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from "ethers";

export const injected = new InjectedConnector({ supportedChainIds: [199] });

export function useWallet() {
  const { activate, deactivate, active, account, library, chainId } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const defaultProvider = async () => {
    return new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_DEFAULT_RPC,
      process.env.REACT_APP_DEFAULT_NETWORK_ID
    )
  }

  const disconnect = async () => {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  };

  // Automatically try reconnecting if the session is still active
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected);
      }
    });
  }, [activate]);

  return { connect, disconnect, active, account, library, chainId, defaultProvider };
}
