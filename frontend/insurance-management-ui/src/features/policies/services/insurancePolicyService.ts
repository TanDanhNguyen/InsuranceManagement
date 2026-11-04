import api from "../../../services/api";

import type {
  InsurancePolicy,
  InsurancePolicyRequest,
  UpdateInsurancePolicyRequest,
} from "../types/insurancePolicy";

const BASE_URL = "/insurancepolicies";

export const insurancePolicyService = {
  getAll: async () => {
    const response = await api.get<InsurancePolicy[]>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<InsurancePolicy>(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  create: async (data: InsurancePolicyRequest) => {
    const response = await api.post<InsurancePolicy>(
      BASE_URL,
      data
    );

    return response.data;
  },

  update: async (
    id: number,
    data: UpdateInsurancePolicyRequest
  ) => {
    const response = await api.put<InsurancePolicy>(
      `${BASE_URL}/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};