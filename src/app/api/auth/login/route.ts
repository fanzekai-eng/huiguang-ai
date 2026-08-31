// 登录 / 注册一体：验证码正确则登录，手机号不存在则自动注册
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone: string = body.phone ?? "";
  const code: string = body.code ?? "";

  if (!/^1\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 });
  }
  if (code !== "123456") {
    return NextResponse.json({ error: "验证码错误" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone } });
  }

  const token = await signToken(user.id);
  const res = NextResponse.json({
    user: { id: user.id, phone: user.phone, credits: user.credits },
  });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
