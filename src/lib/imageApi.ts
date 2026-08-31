// ★ 国内 AI 绘图 API 适配层
// 默认：硅基流动 SiliconFlow（FLUX.1-schnell，免费，每天 400 次）
// 备选：智谱 AI（CogView-3-Flash，官方免费）
// 通过环境变量 IMAGE_PROVIDER / IMAGE_API_KEY 切换，无需改代码。

export const IMAGE_COST = 20; // 每张图消耗积分
export const SIGNUP_CREDITS = 500; // 新用户赠送积分（与数据库默认值一致）

type Provider = "siliconflow" | "zhipu";

interface ProviderConfig {
  baseUrl: string;
  model: string;
  // 尺寸参数名：硅基流动用 image_size，智谱用 size
  sizeKey: "size" | "image_size";
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  siliconflow: {
    baseUrl: "https://api.siliconflow.cn/v1",
    model: "black-forest-labs/FLUX.1-schnell",
    sizeKey: "image_size",
  },
  zhipu: {
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "cogview-3-flash",
    sizeKey: "size",
  },
};

function getProvider(): Provider {
  const p = process.env.IMAGE_PROVIDER?.toLowerCase();
  return p === "zhipu" ? "zhipu" : "siliconflow";
}

export function getImageConfig() {
  const provider = getProvider();
  const cfg = PROVIDERS[provider];
  return {
    provider,
    apiKey: process.env.IMAGE_API_KEY || "",
    baseUrl: process.env.IMAGE_BASE_URL || cfg.baseUrl,
    model: process.env.IMAGE_MODEL || cfg.model,
    sizeKey: cfg.sizeKey,
  };
}

export interface GeneratedImage {
  b64: string;
  mimeType: string;
}

/**
 * 调用绘图 API 生成一张图片，统一返回 base64（存入数据库，永久可用）。
 * 兼容两种返回格式：data[]（智谱/OpenAI 风格）与 images[]（硅基流动风格）；
 * 若服务返回 URL，则自动下载并转成 base64（外部 URL 有时效，不能直接存）。
 */
export async function generateImage(
  prompt: string,
  size: string,
): Promise<GeneratedImage> {
  const { apiKey, baseUrl, model, sizeKey } = getImageConfig();
  if (!apiKey) {
    throw new Error("未配置绘图 API Key（IMAGE_API_KEY），请到服务商控制台获取");
  }

  const res = await fetch(`${baseUrl}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      [sizeKey]: size,
      n: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`绘图服务返回 ${res.status}：${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const item = data?.data?.[0] ?? data?.images?.[0];
  if (!item) {
    throw new Error("绘图服务未返回图片数据");
  }

  if (item.b64_json) {
    return { b64: item.b64_json, mimeType: item.mime_type || "image/png" };
  }

  if (item.url) {
    const imgRes = await fetch(item.url);
    if (!imgRes.ok) throw new Error("图片下载失败");
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const mime = imgRes.headers.get("content-type") || "image/png";
    return { b64: buf.toString("base64"), mimeType: mime };
  }

  throw new Error("绘图服务返回格式异常");
}
