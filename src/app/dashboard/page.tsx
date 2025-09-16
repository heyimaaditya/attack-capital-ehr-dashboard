import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPatients } from "@/services/drchrono";
import PatientTable from "@/components/PatientTable";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("drchrono_access_token");

    if (!accessToken) {
        redirect("/");
    }

    try {
        const patientData = await getPatients();
        const patients = patientData.results;

        return (
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-6">Patient Management</h1>
                <PatientTable patients={patients} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching patients:", error);

        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p>Could not fetch patient data from DrChrono.</p>
                <p className="text-sm text-gray-500 mt-2">
                    Your session may have expired. Please try logging out and back in.
                </p>
            </div>
        );


    }

}