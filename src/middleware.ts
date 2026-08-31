// 路由保护：未登录访问 /generate、/history 时跳转登录页并记住来源
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET =
  process.env.AUTH_SECRET || "dev-secret-change-before-deploy";
const secret = new TextEncoder().encode(AUTH_SECRET);
const COOKIE_NAME = "hg_token";

const PROTECTED_PREFIXES = ["/generate", "/history"];

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  const next = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
  url.search = `?next=${next}`;
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedPath = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!protectedPath) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return redirectToLogin(req);
  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/generate", "/history"],
};
