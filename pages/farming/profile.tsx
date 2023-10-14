import Head from 'next/head';
import rooms from 'utils/config/rooms';
import Link from 'next/link';
import { Icon, IconButton } from '@synthetixio/ui';
import useUserFarmingQuery from 'queries/farming/useUserFarmingQuery';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { formatNumberWithLocale, formatPercent } from '../../utils/numbers';
import { extractDexExchangeEntries } from '../../utils/points';
import classNames from 'classnames';
import styles from 'styles/yams.module.css';
import { Button } from 'components/button';

export default function Profile() {
	const { push } = useRouter();
	const address = null; // '0x123-todo';

	// const exchangeIdsLowercased = rooms.map(room => room.exchange_id.toLowerCase());

	const [userTotals, setUserTotals] = useState<any>({});
	const [platformTotals, setPlatformTotals] = useState<any>({});

	const userFarmingQuery = useUserFarmingQuery();
	useEffect(() => {
		const userTotals = userFarmingQuery?.data?.points[`points`];
		const platformTotals = userFarmingQuery?.data?.points[`pointsPlatform`];

		setUserTotals(userTotals);
		setPlatformTotals(platformTotals);
	}, [userFarmingQuery]);

	// Calculate time til farming
	const targetDate = new Date('2023-10-23T14:00:00+11:00'); // Sydney time (UTC+11)

	const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining());
		}, 1000);

		// Clean up the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	function calculateTimeRemaining() {
		const currentDate = new Date();
		const timeDifference = targetDate - currentDate;

		if (timeDifference > 0) {
			const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

			return { days, hours, minutes, seconds };
		} else {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 };
		}
	}

	function formatTimeRemaining() {
		const { days, hours, minutes, seconds } = timeRemaining;

		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''}`;
		}
		if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''}`;
		}
		if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? 's' : ''}`;
		}
		return `${seconds} second${seconds > 1 ? 's' : ''}`;
	}

	const poolBoxes = (
		<div className="animation-appear animation-delay-1 grid md:grid-cols-2 grid-cols-1 gap-4 w-full container px-0">
			{userTotals
				? Object.values(rooms).map((room, index) => {
						const roomData = rooms.find((r) => r.name === room.name)!;

						let userTotal = 0;
						let userTotalRaw = 0;
						let numUsersInPool = 0;
						let numPointsInPool = 0;

						let exchangeId = room.exchange_id.toLowerCase();
						if (room.exchange_id.toLowerCase() === 'snx') {
							exchangeId = 'synthetix_optimism';
						}

						userTotal = userTotals[exchangeId];
						userTotalRaw = userTotals[`${exchangeId}_raw`];
						numUsersInPool = platformTotals[`${exchangeId}_user_count`];
						numPointsInPool = platformTotals[`${exchangeId}_total_points`];

						// Calculate spot dex features
						if (room.exchange_id.toLowerCase() === 'spot dex') {
							const dexEntries = extractDexExchangeEntries(userTotals);

							// userTotal = sum of dexEntries with key not ending in _raw
							const rawKeys = Object.keys(dexEntries).filter((key) => key.endsWith('_raw'));
							const nonRawKeys = Object.keys(dexEntries).filter((key) => !key.endsWith('_raw'));

							// sum user totals
							userTotal = nonRawKeys.reduce((acc, key) => {
								return acc + dexEntries[key];
							}, 0);

							// sum user totals raw
							userTotalRaw = rawKeys.reduce((acc, key) => {
								return acc + dexEntries[key];
							}, 0);

							// Gather num users in pool
							numUsersInPool = nonRawKeys.reduce((acc, key) => {
								if (platformTotals[`${key}_user_count`] > 0) {
									return acc + platformTotals[`${key}_user_count`];
								}
								return acc;
							}, 0);

							// Gather total num points in pool
							numPointsInPool = nonRawKeys.reduce((acc, key) => {
								if (platformTotals[`${key}_user_count`] > 0) {
									return acc + platformTotals[`${key}_total_points`];
								}
								return acc;
							}, 0);

							exchangeId = 'spot dex';
						}

						// return userTotals[`${room.exchange_id.toLowerCase()}`] > 0 ? (
						return userTotal > 0 ? (
							<div key={index} className={classNames('p-4 rounded-3xl', styles.boxIndent)}>
								<div
									className="flex flex-col items-center p-4 rounded"
									style={{ background: 'rgba(0,0,0,0)' }}
								>
									{/* Box Heading */}
									<div
										className={classNames(
											'flex items-center justify-center w-14 h-14 rounded-full flex-shrink-0 text-3xl',
											styles.boxIndent
										)}
									>
										{roomData.emoji}
									</div>
									<h2 className="text-lg font-bold mt-3">{room.name}</h2>

									{/* Buttons */}
									<div className="flex gap-3">
										{/* <span className="text-xs bg-[#F59260] rounded-3xl p-2 px-3 flex items-center justify-center gap-2">
										<PiggBankIcon width={16} />
										Locked
									</span>
									<span className="text-xs bg-[#F59260] rounded-3xl p-2 px-3 flex items-center justify-center gap-2">
										<LinkIcon width={17} />
										Linked
									</span> */}
									</div>

									{/* Data Points */}
									<div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-4 text-center w-full">
										<div>
											<h3 className="text-sm font-semibold">{`Your points`}</h3>
											<p className="text-sm">{formatNumberWithLocale(userTotal)}</p>
										</div>
										<div>
											<h3 className="text-sm font-semibold">{`Your points (inflation)`}</h3>
											<p className="text-sm">{formatNumberWithLocale(userTotalRaw)}</p>
										</div>
										<div>
											<h3 className="text-sm font-semibold">{`Points in pool`}</h3>
											<p className="text-sm">{formatNumberWithLocale(numPointsInPool)}</p>
										</div>
										<div>
											<h3 className="text-sm font-semibold">{`Users in pool`}</h3>
											<p className="text-sm">{formatNumberWithLocale(numUsersInPool)}</p>
										</div>
									</div>
								</div>
							</div>
						) : (
							''
						);
				  })
				: 'Loading...'}
		</div>
	);

	// todo move to component
	return (
		<>
			<Head>
				<title>Infinex | {address ? address : 'Profile'}</title>
			</Head>

			<div className="relative grow px-3 sm:px-10 py-8 flex flex-col justify-center items-center bg-primary-light gap-6 text-black">
				{/* Back button */}
				<Link href="/farming" className="absolute top-14 p-2 left-3 sm:left-10">
					<Icon name="Left" className="text-black" />
				</Link>
				<h1 className="animation-appear text-black text-4xl font-bold text-center mt-4">
					Your Positions
				</h1>

				{/* Table */}
				<div
					className={classNames(
						'animation-appear hidden rounded-3xl sm:table text-center container py-3 text-lg',
						styles.boxIndent
					)}
				>
					<div className="table-row">
						{[
							'Your governance points',
							'Your governance power',
							'Active governance farmers',
							'Time left to farm',
						].map((heading, index) => (
							<div key={index} className="table-cell px-4 py-2 font-semibold">
								{heading}
							</div>
						))}
					</div>
					<div className="table-row">
						{[
							formatNumberWithLocale(userTotals?.total_points) === 'Loading...'
								? 0
								: formatNumberWithLocale(userTotals?.total_points),
							// formatNumberWithLocale(userTotals?.total_points_raw),
							formatPercent(platformTotals?.total_points / userTotals?.total_points),
							platformTotals?.total_user_count,
							formatTimeRemaining(),
						].map((data, index) => (
							<div key={index} className="table-cell px-4 pb-2">
								{data}
							</div>
						))}
					</div>
				</div>

				{/* Collapsible table for mobile */}
				{/* <div className="animation-appear sm:hidden flex flex-col">
						{['Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5'].map((heading, index) => (
							<div key={index} className="px-4 py-2 border-b border-white">
								{heading}: {'Data' + (index + 1)}
							</div>
						))}
					</div> */}

				{/* Pool Boxes */}
				{!userTotals?.total_points || userTotals?.total_points == 0 ? (
					<div className="grow px-8 sm:px-0 flex flex-col justify-center items-center bg-primary-light text-black">
						{platformTotals?.total_points && (
							<div className="animation-appear animation-appear-delay-1 mb-10 text-lg">
								<p className="text-black font-black text-center font-normal mb-3">
									You don't have any positions yet
								</p>
								<Button
									className={classNames(
										'w-64 h-12 rounded-3xl whitespace-nowrap mr-4 bg-transparent hover:bg-transparent !text-sm',
										styles.buttonIndent
									)}
									onClick={() => {
										push('/farming');
									}}
									label="👩‍🌾 Start Farming"
								/>
							</div>
						)}
					</div>
				) : (
					poolBoxes
				)}
			</div>
		</>
	);
}
