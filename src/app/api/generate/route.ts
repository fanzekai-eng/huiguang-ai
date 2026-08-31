// ★ 核心生成接口：鉴权 → 校验积分 → 先扣分 → 组装提示词 → 调绘图 API → 存库 → 失败自动退还
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/session";
import { buildPrompt, getSize } from "@/lib/promptBuilder";
import { generateImage, IMAGE_COST } from "@/lib/imageApi";

export const runtime = "nodejs";
export const maxDuration = 60;

type GptImageSize = "1024x1024" | "1536x1024" | "1024x1536";

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { type, ratio, style, scene, whitespace, subject, extra } = body;

  if (!subject || typeof subject !== "string" || !subject.trim()) {
    return NextResponse.json({ error: "请填写画面主体" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 401 });

  if (user.credits < IMAGE_COST) {
    return NextResponse.json(
      { error: "积分不足", code: "INSUFFICIENT_CREDITS", credits: user.credits },
      { status: 402 },
    );
  }

  const prompt = buildPrompt({
    type,
    ratio,
    style,
    scene,
    whitespace,
    subject,
    extra,
  });
  const size = getSize(ratio) as GptImageSize;

  // 先扣积分，失败再退还
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: IMAGE_COST } },
  });

  try {
    const { b64, mimeType } = await generateImage(prompt, size);
    if (!b64) throw new Error("绘图服务未返回图片数据");

    const generation = await prisma.generation.create({
      data: {
        userId,
        promptAssembled: prompt,
        optionsJson: JSON.stringify({ type, ratio, style, scene, whitespace }),
        subject: subject.trim(),
        size,
        imageBase64: b64,
        mimeType,
      },
    });

    const updated = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    return NextResponse.json({
      id: generation.id,
      imageUrl: `/api/images/${generation.id}`,
      prompt,
      credits: updated?.credits ?? 0,
    });
  } catch (err) {
    // 生成失败：退还积分
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: IMAGE_COST } },
    });
    const message = err instanceof Error ? err.message : "生成失败";
    return NextResponse.json(
      { error: `生成失败：${message}` },
      { status: 500 },
    );
  }
}
