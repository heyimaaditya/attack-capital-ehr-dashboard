export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender:'Male' | 'Female' | 'Other' | 'Unknown';
    email: string | null;
    cell_phone:string;
}

export interface PatientCreatePayload {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  doctor: number;
  email?: string;
}

export type PatientUpdatePayload = Partial<PatientCreatePayload>;