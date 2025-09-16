import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "cookies-next";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(new URL("/?error=No code", request.url));
    }

    try {

        const response = await fetch("https://drchrono.com/o/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                code: code,
                grant_type: "authorization_code",
                redirect_uri: process.env.DRCHRONO_REDIRECT_URI!,
                client_id: process.env.DRCHRONO_CLIENT_ID!,
                client_secret: process.env.DRCHRONO_CLIENT_SECRET!,
            }),

        });

        if (!response.ok) {

            const errorData = await response.json();
            console.error("Error fetching token:", errorData);
            return NextResponse.redirect(new URL(`/?error=${errorData.error_description}`, request.url));
        }

        const data = await response.json();
        const { access_token, refresh_token, expires_in } = data;

        const redirectUrl = new URL("/dashboard", request.url);
        const responseRedirect = NextResponse.redirect(redirectUrl);

        setCookie("drchrono_access_token", access_token, {
            req: request,
            res: responseRedirect,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: expires_in,
            path: "/",
        });

        setCookie("drchrono_refresh_token", refresh_token, {
            req: request,
            res: responseRedirect,
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            path: "/",
        });

        return responseRedirect;

    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.redirect(new URL("/?error=An unexpected error occurred", request.url));
    }
}