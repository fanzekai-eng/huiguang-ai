import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const [items, user] = await Promise.all([
    prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    }),
  ]);

  return NextResponse.json({
    credits: user?.credits ?? 0,
    items: items.map((g) => ({
      id: g.id,
      imageUrl: `/api/images/${g.id}`,
      subject: g.subject,
      prompt: g.promptAssembled,
      size: g.size,
      createdAt: g.createdAt,
    })),
  });
}
