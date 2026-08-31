// 图片输出接口：按 id 返回图片二进制，仅本人可访问
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { id } = await params;
  const gen = await prisma.generation.findFirst({ where: { id, userId } });
  if (!gen?.imageBase64) {
    return NextResponse.json({ error: "图片不存在" }, { status: 404 });
  }

  const buf = Buffer.from(gen.imageBase64, "base64");
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": gen.mimeType || "image/png",
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
