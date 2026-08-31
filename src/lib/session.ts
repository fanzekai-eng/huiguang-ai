// 服务端会话工具：从请求 Cookie 中解析当前登录用户
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "./auth";

export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
