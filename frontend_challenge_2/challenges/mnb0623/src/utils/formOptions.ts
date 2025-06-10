import {
  powerDataConfig,
  type CompanyKey,
  type PlanKey,
} from '../constants/powerDataConfig';
import type { SelectOption } from '../components/General/SelectBox/SelectBox';

export const getPowerCompanyOptions = (
  area: 'tokyo' | 'kansai' | 'other'
): SelectOption[] => {
  if (area === 'tokyo' || area === 'kansai') {
    return [
      { value: area, label: powerDataConfig[area].name },
      { value: 'other', label: 'その他' },
    ];
  }
  return [];
};

export const getServicePlanOptions = (
  powerCompanyValue: string
): SelectOption[] => {
  if (!powerCompanyValue || powerCompanyValue === 'other') {
    return [];
  }
  const company = powerDataConfig[powerCompanyValue as CompanyKey];
  if (!company) return [];

  return Object.entries(company.plans).map(([key, plan]) => ({
    value: key,
    label: plan.name,
  }));
};

export const getContractCapacityOptions = (
  powerCompanyValue: string,
  servicePlanValue: PlanKey<CompanyKey> | ''
): SelectOption[] => {
  if (
    !powerCompanyValue ||
    !servicePlanValue ||
    powerCompanyValue === 'other'
  ) {
    return [];
  }
  const company = powerDataConfig[powerCompanyValue as CompanyKey];
  const plan = company?.plans[servicePlanValue];

  return plan?.capacities || [];
};
