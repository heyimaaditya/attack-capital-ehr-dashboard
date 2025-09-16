import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("drchrono_access_token");

    if (!accessToken) {
        redirect("/");
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">EHR Dashboard</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You have successfully connected your DrChrono account.</p>
                    <p className="mt-4 text-sm text-green-600">
                        Authentication successful. We can now begin fetching data.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}