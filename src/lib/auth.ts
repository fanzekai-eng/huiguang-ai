import { SignJWT, jwtVerify } from "jose";

const AUTH_SECRET =
  process.env.AUTH_SECRET || "dev-secret-change-before-deploy";

const secret = new TextEncoder().encode(AUTH_SECRET);

const COOKIE_NAME = "hg_token";

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
