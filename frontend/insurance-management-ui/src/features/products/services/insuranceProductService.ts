
import api from "../../../services/api";

import type {
  InsuranceProduct,
  InsuranceProductRequest,
  UpdateInsuranceProductRequest,
} from "../types/insuranceProduct";

const endpoint = "/InsuranceProducts";

const getAll = async (): Promise<InsuranceProduct[]> => {
  const response = await api.get(endpoint);
  return response.data;
};

const getById = async (id: number): Promise<InsuranceProduct> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

const create = async (
  request: InsuranceProductRequest
): Promise<InsuranceProduct> => {
  const response = await api.post(endpoint, request);
  return response.data;
};

const update = async (
  id: number,
  request: UpdateInsuranceProductRequest
): Promise<InsuranceProduct> => {
  const response = await api.put(`${endpoint}/${id}`, request);
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  await api.delete(`${endpoint}/${id}`);
};

const insuranceProductService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default insuranceProductService;
