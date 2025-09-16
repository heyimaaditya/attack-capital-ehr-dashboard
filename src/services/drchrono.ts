import { PaginatedResponse, Patient, PatientCreatePayload, PatientUpdatePayload } from "@/types/drchrono";
import { cookies } from "next/headers";

const API_BASE_URL = "https://drchrono.com/api";

async function getAccessToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("drchrono_access_token")?.value;
    if (!accessToken) {
        throw new Error("Not authorized");
    }
    return accessToken;
}

async function fetchFromDrChrono<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = getAccessToken(); 

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error (${response.status}): ${errorBody}`);
    throw new Error(`Failed to fetch data from DrChrono: ${response.statusText}`);
  }

  return response.json();
}

async function clientFetchFromDrChrono<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error (${response.status}): ${errorBody}`);
    throw new Error(`Failed to mutate data at DrChrono: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export const getPatients = async (): Promise<PaginatedResponse<Patient>> => {
  return fetchFromDrChrono<PaginatedResponse<Patient>>("patients");
};

export const createPatient = (
  patientData: PatientCreatePayload,
  token: string
): Promise<Patient> => {
  return clientFetchFromDrChrono<Patient>("patients", token, {
    method: "POST",
    body: JSON.stringify(patientData),
  });
};

export const updatePatient = (
  patientId: number,
  patientData: PatientUpdatePayload,
  token: string
): Promise<Patient> => {
  return clientFetchFromDrChrono<Patient>(`patients/${patientId}`, token, {
    method: "PATCH",
    body: JSON.stringify(patientData),
  });
};

export const deletePatient = (patientId: number, token: string): Promise<null> => {
  return clientFetchFromDrChrono<null>(`patients/${patientId}`, token, {
    method: "DELETE",
  });
};
