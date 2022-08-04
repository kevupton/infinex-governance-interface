import { OnboardAPI } from '@web3-onboard/core';
import { ethers } from 'ethers';
import { onboard } from './config';

import { NetworkId, NetworkName } from '@synthetixio/contracts-interface';

export type Network = {
	id: NetworkId;
	name: NetworkName;
	useOvm: boolean;
};

type ConnectorState = {
	network: Network | null;
	provider: ethers.providers.Web3Provider | null;
	signer: ethers.Signer | null;
	isAppReady: boolean;
	walletAddress: string | null;
	walletWatched: string | null;
	walletType: string | null;
	ensName: string | null;
	ensAvatar: string | null;
	onboard: OnboardAPI | null;
};

export enum AppEvents {
	APP_READY = 'APP_READY',
	CONFIG_UPDATE = 'CONFIG_UPDATE',
	WATCH_WALLET = 'WATCH_WALLET',
	SET_ENS = 'SET_ENS',
	UPDATE_PROVIDER = 'UPDATE_PROVIDER',
	WALLET_DISCONNECTED = 'WALLET_DISCONNECTED',
}

export const initialState: ConnectorState = {
	network: null,
	provider: null,
	signer: null,
	isAppReady: false,
	walletAddress: null,
	walletWatched: null,
	walletType: null,
	ensName: null,
	ensAvatar: null,
	onboard: onboard,
};

export type ConnectionUpdate = {
	address: string;
	network: Network;
	signer: ethers.Signer | null;
	walletWatched: null;
	walletType: string | null;
	provider: ethers.providers.Web3Provider;
	ensName: string | null;
	ensAvatar: string | null;
};

export type EnsUpdate = {
	ensName: string | null;
	ensAvatar: string | null;
};

export type WatchWallet = {
	ensName: string | null;
	address: string | null;
	walletWatched: string | null;
};

export type ProviderUpdate = {
	provider: ethers.providers.Web3Provider;
	network: Network;
};

export type Actions =
	| { type: AppEvents.APP_READY; payload: OnboardAPI }
	| { type: AppEvents.CONFIG_UPDATE; payload: ConnectionUpdate }
	| { type: AppEvents.WATCH_WALLET; payload: WatchWallet }
	| { type: AppEvents.SET_ENS; payload: EnsUpdate }
	| { type: AppEvents.UPDATE_PROVIDER; payload: ProviderUpdate }
	| { type: AppEvents.WALLET_DISCONNECTED };

export function reducer(state: ConnectorState, action: Actions) {
	switch (action.type) {
		case AppEvents.APP_READY:
			return { ...state, isAppReady: true, onboard: action.payload };

		case AppEvents.CONFIG_UPDATE:
			return {
				...state,
				walletWatched: action.payload.walletWatched,
				walletType: action.payload.walletType,
				walletAddress: action.payload.address,
				network: action.payload.network,
				signer: action.payload.signer,
				provider: action.payload.provider,
				ensName: action.payload.ensName,
				ensAvatar: action.payload.ensAvatar,
			};

		case AppEvents.WATCH_WALLET:
			return {
				...state,
				walletAddress: action.payload.address,
				ensName: action.payload.ensName,
				walletWatched: action.payload.walletWatched,
			};

		case AppEvents.SET_ENS:
			return { ...state, ensName: action.payload.ensName, ensAvatar: action.payload.ensAvatar };

		case AppEvents.WALLET_DISCONNECTED:
			return {
				...state,
				network: null,
				provider: null,
				signer: null,
				walletAddress: null,
				watchedWallet: null,
				walletType: null,
				ensName: null,
				ensAvatar: null,
			};

		case AppEvents.UPDATE_PROVIDER:
			return {
				...state,
				provider: action.payload.provider,
				network: action.payload.network,
			};

		default:
			return { ...state };
	}
}
