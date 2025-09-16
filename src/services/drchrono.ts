import { PaginatedResponse, Patient } from "@/types/drchrono";
import { cookies } from "next/headers";
import { mockPaginatedPatients } from "@/lib/mock-data";

const API_BASE_URL = "https://drchrono.com/api";

async function getAccessToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("drchrono_access_token")?.value;
    if (!accessToken) {
        throw new Error("Not authorized");
    }
    return accessToken;
}

async function fetchFromDrChrono<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },

        cache: 'no-store',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error (${response.status}): ${errorBody}`);
        throw new Error(`Failed to fetch data from DrChrono: ${response.statusText}`);
    }

    return response.json();
}

export const getPatients = async (): Promise<PaginatedResponse<Patient>> => {
    const accessToken = await getAccessToken();

    if (accessToken === "FAKE_ACCESS_TOKEN_FOR_DEVELOPMENT") {
        console.log("DEV MODE: Returning mock patient data.");
        return Promise.resolve(mockPaginatedPatients);
    }

    return fetchFromDrChrono<PaginatedResponse<Patient>>("patients");
};
