import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage(){

  const getAuthUrl=()=>{
    const params=new URLSearchParams({
      redirect_uri: process.env.DRCHRONO_REDIRECT_URI!,
      response_type: "code",
      client_id: process.env.DRCHRONO_CLIENT_ID!,
      scope: "patients:read patients:write appointments:read appointments:write clinical:read clinical:write billing:read",
    });
    return `https://drchrono.com/o/authorize/?${params.toString()}`
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">EHR Integration Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-center text-gray-600">
              Please connect your DrChrono account to continue.
            </p>
            <a href={getAuthUrl()}>
              <Button size="lg">Connect to DrChrono</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );

}