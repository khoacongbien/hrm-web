// pages/api/login.js

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("sessionToken");
  if (!sessionToken) {
    return NextResponse.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json(sessionToken, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken = ''; Path=/; HttpOnly`,
    },
  });
}
