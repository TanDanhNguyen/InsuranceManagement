
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  status: "Active" | "Inactive";
}

export type CustomerRequest = Omit<Customer, "id">;
