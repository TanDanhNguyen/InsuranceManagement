
import type { Customer, CustomerRequest } from "../types/customer";
import api from "../../../services/api";

const BASE_URL = "/customers";

export const customerService = {
  getAll: async (search?: string, status?: string) => {
    const response = await api.get<Customer[]>(BASE_URL, {
      params: { search, status },
    });

    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Customer>(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  create: async (data: CustomerRequest) => {
    const response = await api.post<Customer>(
      BASE_URL,
      data
    );

    return response.data;
  },

  update: async (id: number, data: CustomerRequest) => {
    const response = await api.put<Customer>(
      `${BASE_URL}/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`${BASE_URL}/${id}`);
  },
};