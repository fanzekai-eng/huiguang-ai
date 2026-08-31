// ★ 提示词组装引擎：把用户的勾选项 + 主体描述组装成专业 GPT Image 提示词

import { getItem, RATIO_SIZES, OptionKey } from "./options";

export interface PromptInput {
  type: string;
  ratio: string;
  style: string;
  scene: string;
  whitespace: string;
  subject: string; // 用户输入的画面主体（可为中文）
  extra?: string; // 补充要求（可选）
}

const QUALITY_TAIL =
  "ultra detailed, sharp focus, high resolution, professional quality";

function part(groupKey: OptionKey, id: string): string {
  return getItem(groupKey, id)?.promptPart ?? "";
}

export function buildPrompt(input: PromptInput): string {
  const subject = input.subject.trim();
  const type = part("type", input.type);
  const style = part("style", input.style);
  const scene = part("scene", input.scene);
  const whitespace = part("whitespace", input.whitespace);
  const extra = input.extra?.trim();

  // 以「类型短语 of 主体」开头，主体保持用户原样（GPT Image 支持中英混合理解）
  const segments: string[] = [];

  if (type && subject) {
    segments.push(`${type} of ${subject}`);
  } else if (type) {
    segments.push(type);
  } else if (subject) {
    segments.push(subject);
  }

  if (style) segments.push(style);
  if (scene) segments.push(scene);
  if (whitespace) segments.push(whitespace);
  if (extra) segments.push(extra.replace(/[。；;]+$/, ""));
  segments.push(QUALITY_TAIL);

  return segments.join(", ");
}

export function getSize(ratioId: string): string {
  return RATIO_SIZES[ratioId] ?? "1024x1024";
}
