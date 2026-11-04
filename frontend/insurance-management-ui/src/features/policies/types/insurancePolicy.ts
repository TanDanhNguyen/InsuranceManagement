export type PolicyStatus =
  | "Pending"
  | "Active"
  | "Expired"
  | "Cancelled";

export interface InsurancePolicy {
  id: number;
  policyNumber: string;
  customerId: number;
  productId: number;
  productCode: string;
  productName: string;
  insuranceType: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: PolicyStatus;
  createdAtUtc: string;
}

export interface InsurancePolicyRequest {
  customerId: number;
  productId: number;
  startDate: string;
  endDate: string;
  premium: number;
}

export interface UpdateInsurancePolicyRequest {
  productId: number;
  startDate: string;
  endDate: string;
  premium: number;
}