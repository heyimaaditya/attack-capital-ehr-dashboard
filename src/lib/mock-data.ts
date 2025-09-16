import { PaginatedResponse, Patient } from "@/types/drchrono";

export const mockPatients: Patient[] = [
  {
    id: 101,
    first_name: "John",
    last_name: "Appleseed",
    date_of_birth: "1985-04-12",
    gender: "Male",
    email: "john.appleseed@example.com",
    cell_phone: "555-0101",
  },
  {
    id: 102,
    first_name: "Jane",
    last_name: "Doe",
    date_of_birth: "1992-08-23",
    gender: "Female",
    email: "jane.doe@example.com",
    cell_phone: "555-0102",
  },
  {
    id: 103,
    first_name: "Peter",
    last_name: "Jones",
    date_of_birth: "1978-11-02",
    gender: "Male",
    email: "peter.jones@example.com",
    cell_phone: "555-0103",
  },
];

export const mockPaginatedPatients: PaginatedResponse<Patient> = {
  count: mockPatients.length,
  next: null,
  previous: null,
  results: mockPatients,
};