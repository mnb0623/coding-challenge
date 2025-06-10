import { useState } from 'react';
import { type PlanKey, type CompanyKey } from '../constants/powerDataConfig';

type SimulationFormData = {
  postalCode: string;
  area: CompanyKey; // 'tokyo' | 'kansai' | 'other'
  powerCompany: CompanyKey | '';
  servicePlan: PlanKey<CompanyKey> | '';
  contractCapacity: string;
  lastMonthAmount: string;
};

type FormField =
  | 'postalCode'
  | 'powerCompany'
  | 'servicePlan'
  | 'contractCapacity'
  | 'lastMonthAmount';

type FormErrors = {
  postalCode?: string;
  powerCompany?: string;
  servicePlan?: string;
  contractCapacity?: string;
  lastMonthAmount?: string;
};

const validatePostalCode = (value: string): string | null => {
  if (!value) {
    return null;
  }
  if (!/^\d+$/.test(value)) {
    return '半角数字のみで入力してください。';
  }
  const firstDigit = value.charAt(0);
  if (firstDigit !== '1' && firstDigit !== '5') {
    return 'サービスエリア対象外です。';
  }

  return null;
};

// 郵便番号からエリアを判定する関数
const determineAreaFromPostalCode = (value: string): CompanyKey => {
  if (value.length === 7) {
    const firstDigit = value.charAt(0);
    if (firstDigit === '1') return 'tokyo';
    if (firstDigit === '5') return 'kansai';
  }
  return 'other';
};
// 電力会社の選択肢を検証する関数
const validatePowerCompany = (value: string): string | null => {
  if (value === 'other') {
    return 'シミュレーション対象外です。';
  }
  return null;
};

const validateAmount = (value: string): string | null => {
  if (!value) {
    return null;
  }
  if (!/^\d+$/.test(value)) {
    return '半角数字のみで入力してください。';
  }
  const amount = parseInt(value, 10);
  if (isNaN(amount) || amount < 1000) {
    return '金額は1000円以上でなければなりません。';
  }
  return null;
};

export const useSimulationForm = () => {
  const [formData, setFormData] = useState<SimulationFormData>({
    postalCode: '',
    powerCompany: '',
    area: 'other',
    servicePlan: '',
    contractCapacity: '',
    lastMonthAmount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: FormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    let error: string | null = null;

    if (field === 'postalCode') {
      const postalCodeError = validatePostalCode(value);
      error = postalCodeError ?? null;

      const newArea = determineAreaFromPostalCode(value);
      setFormData((prev) => ({
        ...prev,
        area: newArea,
        powerCompany: '',
        servicePlan: '',
        contractCapacity: '',
      }));
    }
    if (field === 'powerCompany') {
      error = validatePowerCompany(value);
      // 電力会社が選択された場合、サービスプランと契約容量をリセット
      setFormData((prev) => ({
        ...prev,
        servicePlan: '',
        contractCapacity: '',
      }));
    }
    if (field === 'servicePlan') {
      // サービスプランが選択された場合、契約容量をリセット
      setFormData((prev) => ({
        ...prev,
        contractCapacity: '',
      }));
    }
    if (field === 'contractCapacity') {
      error = null;
    }
    if (field === 'lastMonthAmount') {
      error = validateAmount(value);
    }
    setErrors((prev) => ({
      ...prev,
      [field]: error ?? undefined,
    }));
  };

  const handleSubmit = async () => {
    try {
      // 送信処理 擬似的に1秒待機
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('送信データ:', formData);
    } catch (error) {
      console.error('送信エラー:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
      alert('送信完了:');
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
};
