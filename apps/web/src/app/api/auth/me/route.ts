import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 },
        );
    }

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) {
        return NextResponse.json(
            { message: "Failed to verify" },
            { status: res.status },
        );
    }

    const data = await res.json();
    const response = NextResponse.json(data);

    return response;
}
