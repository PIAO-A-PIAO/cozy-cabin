import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/tracks`, {
    method: "GET",
  });

  if (!res.ok) {
    return NextResponse.json(
      { message: "Failed to load tracks" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
