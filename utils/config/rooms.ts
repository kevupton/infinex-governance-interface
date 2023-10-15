const rooms = [
	{
		type: 'dex',
		key: 13,
		name: 'Spot Dex Sauna',
		description: 'Connect your address\\nEarn Voting Power',
		emoji: '❤️‍🔥',
		token: '',
		info: "We collect volumes from over 30 spot DEX's incouding Uniswap, Sushiswap and Curve",
		exchange_id: 'Spot Dex',
		needsApiPass: false,
		linking: true,
		locking: false,
		dex: true,
	},
	{
		type: 'cex',
		key: 1,
		name: 'Binance Forecourt',
		description: 'Deposit BNB\\nEarn Voting Power',
		emoji: '⛲',
		token: 'BNB',
		exchange_id: 'Binance',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only BNB on the binance smart chain will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/binance-guide',
	},
	{
		type: 'dex',
		key: 14,
		name: 'Spartan Grounds',
		description: 'Connect your address\\nEarn Voting Power',
		emoji: '⚔️',
		token: '',
		exchange_id: 'SNX',
		needsApiPass: false,
		linking: true,
		locking: false,
		dex: true,
	},
	{
		type: 'cex',
		key: 2,
		name: 'FTX Panic Room',
		description: 'Deposit FTT\\nEarn Voting Power',
		emoji: '🫣',
		token: 'FTT',
		exchange_id: 'FTX',
		needsApiPass: false,
		linking: false,
		locking: true,
		dex: false,
	},
	{
		type: 'cex',
		key: 3,
		name: 'Kucoin Scullery',
		description: 'Deposit KCS\\nEarn Voting Power',
		emoji: '🛖',
		token: 'KCS',
		exchange_id: 'Kucoin',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only KCS on Ethereum Mainnet will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/kucoin-guide',
	},
	// {type:"cex", key: 4, name: "His Excellency’s Chambers", description: "Deposit HT, Earn Voting Power", emoji: "🧖‍♂️", token: "HT", exchange_id: "Huobi", needsApiPass: false},
	{
		type: 'cex',
		key: 5,
		name: 'BitMex Ballroom',
		description: 'Deposit BMEX\\nEarn Voting Power',
		emoji: '💃',
		token: 'BMEX',
		exchange_id: 'Bitmex',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bitmex-guide',
	},
	{
		type: 'dex',
		key: 6,
		name: 'dYdX Observatory',
		description: 'Deposit DYDX\\nEarn Voting Power',
		emoji: '🔭',
		token: 'DYDX',
		exchange_id: 'Dydx',
		info: 'We track your deposits to DYDX layer 2',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: true,
	},
	{
		type: 'dex',
		key: 7,
		name: 'Blueberry Fields',
		description: 'Deposit GMX\\nEarn Voting Power',
		emoji: '🫐',
		token: 'GMX',
		info: 'We collect volumes from Arbirtum and Avalanche',
		exchange_id: 'GMX',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: true,
	},
	{
		type: 'cex',
		key: 8,
		name: 'Bybit Pillow Chamber',
		description: 'Deposit MNT\\nEarn Voting Power',
		emoji: '🌖',
		token: 'MNT',
		exchange_id: 'Bybit',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		extra_details: 'Only MNT on Ethereum Mainnet will be detected.',
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bybit-guide',
	},
	{
		type: 'cex',
		key: 9,
		name: 'OKX Pitstop',
		description: 'Deposit OKB\\nEarn Voting Power',
		emoji: '🏁',
		token: 'OKB',
		exchange_id: 'OKX',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/okx-guide',
	},
	{
		type: 'cex',
		key: 10,
		name: 'The Bitget Laundromat',
		description: 'Deposit BGB\\nEarn Voting Power',
		emoji: '🧺',
		token: 'BGB',
		exchange_id: 'Bitget',
		needsApiPass: true,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/bitget-guide',
	},
	{
		type: 'cex',
		key: 11,
		name: 'MEXC Nursery',
		description: 'Deposit MX\\nEarn Voting Power',
		emoji: '🤱',
		token: 'MX',
		exchange_id: 'MEXC',
		needsApiPass: false,
		linking: true,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/mexc-guide',
	},
	{
		type: 'cex',
		key: 12,
		name: 'Kraken Quarters',
		description: 'Link your API keys\\nEarn Voting Power',
		emoji: '🐙',
		token: '',
		exchange_id: 'Kraken',
		info: "Krakens API really does not like what we're doing, please be patient getting your results",
		needsApiPass: false,
		linking: false,
		locking: true,
		dex: false,
		guide:
			'https://docs.infinex.io/governance/elections-and-voting/governance-farming/linking-your-api-keys/kraken-guide',
	},
];

export default rooms;
