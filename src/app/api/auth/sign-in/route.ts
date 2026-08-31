// 每日签到：一天只能签一次，每次 +5 积分
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { DAILY_SIGN_CREDITS } from "@/lib/imageApi";
import { todayCN } from "@/lib/dates";

export async function POST() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 401 });
  }

  const today = todayCN();

  // 今天已签到过
  if (user.lastSignInAt === today) {
    return NextResponse.json({
      ok: false,
      signedIn: true,
      already: true,
      credits: user.credits,
    });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      credits: { increment: DAILY_SIGN_CREDITS },
      lastSignInAt: today,
    },
  });

  return NextResponse.json({
    ok: true,
    signedIn: true,
    already: false,
    gained: DAILY_SIGN_CREDITS,
    credits: updated.credits,
  });
}
