import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { todayCN } from "@/lib/dates";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ user: null });

  const today = todayCN();
  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      credits: user.credits,
      signedInToday: user.lastSignInAt === today,
      lastSignInAt: user.lastSignInAt,
    },
  });
}
