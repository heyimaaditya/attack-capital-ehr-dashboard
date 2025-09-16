'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";

export default function LoginPage(){

  const router=useRouter();

  const getAuthUrl=()=>{
    const params=new URLSearchParams({
      redirect_uri: process.env.DRCHRONO_REDIRECT_URI!,
      response_type: "code",
      client_id: process.env.DRCHRONO_CLIENT_ID!,
      scope: "patients:read patients:write appointments:read appointments:write clinical:read clinical:write billing:read",
    });
    return `https://drchrono.com/o/authorize/?${params.toString()}`
  };

  const handleDeveloperLogin=()=>{
     Cookies.set("drchrono_access_token", "FAKE_ACCESS_TOKEN_FOR_DEVELOPMENT", { expires: 1 }); 
      router.push("/dashboard");
  }

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
              <Button size="lg" className="w-full">Connect to DrChrono (Real Flow)</Button>
            </a>
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full"
              onClick={handleDeveloperLogin}
            >
              Developer Login (Simulated)
            </Button>
            <p className="text-xs text-gray-500 pt-2">Use Developer Login to bypass DrChrono and work with mock data.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );

}