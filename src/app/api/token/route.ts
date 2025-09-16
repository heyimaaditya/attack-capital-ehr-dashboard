import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("drchrono_access_token")?.value;

  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ accessToken });
}