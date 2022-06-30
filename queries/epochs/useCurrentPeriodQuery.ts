import { useQuery } from 'react-query';
import { useModulesContext } from 'containers/Modules';
import { DeployedModules } from 'containers/Modules';
import { CouncilsDictionaryType, COUNCILS_DICTIONARY } from 'constants/config';

export enum EpochPeriods {
	ADMINISTRATION = 0,
	NOMINATION = 1,
	VOTING = 2,
	EVALUATION = 3,
}

type CurrentPeriod = {
	currentPeriod: keyof typeof EpochPeriods;
};

type CurrentPeriodsWithCouncils = Record<CouncilsDictionaryType['slug'], keyof typeof EpochPeriods>;

function useCurrentPeriod(moduleInstance?: DeployedModules) {
	const governanceModules = useModulesContext();

	return useQuery<CurrentPeriod | CurrentPeriodsWithCouncils[]>(
		['currentPeriod', moduleInstance],
		async () => {
			if (!moduleInstance) {
				const promises = COUNCILS_DICTIONARY.map((council) =>
					governanceModules[council.module]?.contract.getCurrentPeriod()
				);
				const rawNumber = await Promise.all(promises);
				const results = rawNumber.map((raw) => Number(raw));
				return COUNCILS_DICTIONARY.map((council, index) => ({
					[council.slug]: EpochPeriods[results[index]] as keyof typeof EpochPeriods,
				}));
			}
			const contract = governanceModules[moduleInstance]?.contract;
			let currentPeriod = Number(await contract?.getCurrentPeriod());

			return { currentPeriod: EpochPeriods[currentPeriod] as keyof typeof EpochPeriods };
		},
		{
			enabled: governanceModules !== null,
			staleTime: 900000,
		}
	);
}

export default useCurrentPeriod;
