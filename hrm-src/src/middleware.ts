import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/department", "/"];
const authPath = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname);
  const sessionToken = request.cookies.get("sessionToken")?.value;

  const checkSessionToken =
    sessionToken === "''" || !sessionToken ? false : true;

  const isPrivatePath = privatePath.some(
    (path) => pathname.startsWith(path) && !authPath.includes(pathname)
  );

  if (isPrivatePath && !checkSessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authPath.includes(pathname) && checkSessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/department/:path*", "/", "/login/:path*"],
};
