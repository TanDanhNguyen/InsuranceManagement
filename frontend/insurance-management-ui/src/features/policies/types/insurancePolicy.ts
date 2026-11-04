export type PolicyStatus =
  | "Pending"
  | "Active"
  | "Expired"
  | "Cancelled";

export interface InsurancePolicy {
  id: number;
  policyNumber: string;
  customerId: number;
  insuranceType: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: PolicyStatus;
  createdAtUtc: string;
}

export interface InsurancePolicyRequest {
  customerId: number;
  insuranceType: string;
  startDate: string;
  endDate: string;
  premium: number;
}

export interface UpdateInsurancePolicyRequest {
  insuranceType: string;
  startDate: string;
  endDate: string;
  premium: number;
}