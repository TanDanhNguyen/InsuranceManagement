
export interface InsuranceProduct {
  id: number;
  productCode: string;
  productName: string;
  insuranceType: string;
  description: string;
  basePremium: number;
  isActive: boolean;
  createdAtUtc: string;
}

export interface InsuranceProductRequest {
  productCode: string;
  productName: string;
  insuranceType: string;
  description: string;
  basePremium: number;
}

export interface UpdateInsuranceProductRequest {
  productName: string;
  insuranceType: string;
  description: string;
  basePremium: number;
  isActive: boolean;
}
