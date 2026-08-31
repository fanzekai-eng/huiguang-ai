// 勾选选项配置：所有可勾选项及其对应的英文提示词片段

export type OptionKey = "type" | "ratio" | "style" | "scene" | "whitespace";

export interface OptionItem {
  id: string;
  label: string;
  promptPart: string;
}

export interface OptionGroup {
  key: OptionKey;
  label: string;
  items: OptionItem[];
}

// 图片类型 → 决定整体措辞风格
export const TYPE_OPTIONS: OptionItem[] = [
  { id: "avatar", label: "头像", promptPart: "a portrait-style avatar image" },
  { id: "wallpaper", label: "手机壁纸", promptPart: "a vertical wallpaper artwork" },
  { id: "poster", label: "海报", promptPart: "a graphic poster design" },
  { id: "product", label: "商品图", promptPart: "a commercial product photography" },
  { id: "illustration", label: "插画", promptPart: "a hand-drawn illustration" },
  { id: "photography", label: "摄影写实", promptPart: "a realistic photograph" },
  { id: "render3d", label: "3D 渲染", promptPart: "a high-quality 3D rendered image" },
  { id: "sticker", label: "表情包", promptPart: "a cute sticker-style illustration" },
];

// 比例 → 映射 gpt-image-1 支持的 size
export const RATIO_OPTIONS: OptionItem[] = [
  { id: "1:1", label: "1:1", promptPart: "square composition" },
  { id: "3:4", label: "3:4", promptPart: "vertical portrait composition" },
  { id: "4:3", label: "4:3", promptPart: "horizontal landscape composition" },
  { id: "9:16", label: "9:16", promptPart: "tall vertical composition" },
  { id: "16:9", label: "16:9", promptPart: "wide horizontal composition" },
];

export const RATIO_SIZES: Record<string, string> = {
  "1:1": "1024x1024",
  "3:4": "1024x1536",
  "4:3": "1536x1024",
  "9:16": "1024x1536",
  "16:9": "1536x1024",
};

export const STYLE_OPTIONS: OptionItem[] = [
  { id: "minimal", label: "极简", promptPart: "minimalist style, clean and simple" },
  { id: "anime", label: "动漫", promptPart: "anime style, vibrant and expressive" },
  { id: "watercolor", label: "水彩", promptPart: "soft watercolor painting style" },
  { id: "cyberpunk", label: "赛博朋克", promptPart: "cyberpunk aesthetic with neon lights" },
  { id: "oilpainting", label: "油画", promptPart: "classical oil painting style" },
  { id: "guochao", label: "国潮", promptPart: "Chinese trendy guochao style with traditional elements" },
  { id: "cute", label: "温馨可爱", promptPart: "cute and warm style, soft colors" },
  { id: "cinematic", label: "电影感", promptPart: "cinematic style with dramatic lighting" },
  { id: "flat", label: "扁平插画", promptPart: "flat vector illustration style, warm and cozy" },
  { id: "futuristic", label: "未来科技", promptPart: "futuristic sci-fi style with glowing light effects" },
];

export const SCENE_OPTIONS: OptionItem[] = [
  { id: "studio", label: "纯色棚拍", promptPart: "on a solid-color studio background" },
  { id: "indoor", label: "室内", promptPart: "in a cozy indoor setting" },
  { id: "city", label: "城市街景", promptPart: "in a city street scene" },
  { id: "nature", label: "自然风光", promptPart: "in a beautiful natural landscape" },
  { id: "space", label: "太空", promptPart: "in outer space with a starry background" },
  { id: "none", label: "不限场景", promptPart: "" },
];

export const WHITESPACE_OPTIONS: OptionItem[] = [
  { id: "none", label: "无留白", promptPart: "full composition, no empty space" },
  { id: "some", label: "适度留白", promptPart: "moderate negative space" },
  { id: "lots", label: "大量留白", promptPart: "generous negative space, minimal composition, suitable for adding text" },
];

export const OPTION_GROUPS: OptionGroup[] = [
  { key: "type", label: "图片类型", items: TYPE_OPTIONS },
  { key: "ratio", label: "比例", items: RATIO_OPTIONS },
  { key: "style", label: "风格", items: STYLE_OPTIONS },
  { key: "scene", label: "场景", items: SCENE_OPTIONS },
  { key: "whitespace", label: "留白要求", items: WHITESPACE_OPTIONS },
];

export function getItem(groupKey: OptionKey, id: string): OptionItem | undefined {
  const group = OPTION_GROUPS.find((g) => g.key === groupKey);
  return group?.items.find((i) => i.id === id);
}

export const DEFAULT_OPTIONS = {
  type: "illustration",
  ratio: "1:1",
  style: "minimal",
  scene: "none",
  whitespace: "some",
};
