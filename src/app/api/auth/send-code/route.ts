// 发送验证码（第一版为模拟：固定 123456，前端直接展示，后续可无缝切换真实短信服务）
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone: string = body.phone ?? "";

  if (!/^1\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "请输入正确的手机号" }, { status: 400 });
  }

  return NextResponse.json({
    code: "123456",
    mock: true,
    message: "测试环境验证码已生成",
  });
}
