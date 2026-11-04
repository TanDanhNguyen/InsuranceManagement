
import type { Customer, CustomerRequest } from "../types/customer";

let customers: Customer[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "0901234567",
    dateOfBirth: "1990-05-15",
    address: "New York, USA",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily@example.com",
    phoneNumber: "0902345678",
    dateOfBirth: "1988-08-20",
    address: "California, USA",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    phoneNumber: "0903456789",
    dateOfBirth: "1992-03-10",
    address: "Texas, USA",
    status: "Inactive",
  },
];

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  async getAll(): Promise<Customer[]> {
    await delay(200);
    return [...customers];
  },

  async create(request: CustomerRequest): Promise<Customer> {
    await delay(200);

    const customer: Customer = {
      ...request,
      id: Math.max(0, ...customers.map((x) => x.id)) + 1,
    };

    customers = [...customers, customer];

    return customer;
  },

  async update(
    id: number,
    request: CustomerRequest
  ): Promise<Customer> {
    await delay(200);

    const index = customers.findIndex((x) => x.id === id);

    if (index === -1) {
      throw new Error("Customer not found");
    }

    const updated = { ...request, id };

    customers = customers.map((x) =>
      x.id === id ? updated : x
    );

    return updated;
  },

  async delete(id: number): Promise<void> {
    await delay(200);

    customers = customers.filter((x) => x.id !== id);
  },
};
