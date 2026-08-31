// ★ 热门模板：面向四类人群的预设选项组合，点击一键填充生图页

export interface TemplateOptions {
  type: string;
  ratio: string;
  style: string;
  scene: string;
  whitespace: string;
}

export interface Template {
  id: string;
  name: string;
  audience: string; // 人群标签
  desc: string; // 一句话说明
  options: TemplateOptions;
  subject: string; // 示例主体（用户可改成自己的话）
  extra?: string; // 示例补充要求
  preview: string; // 卡片示意预览色
  accent: string; // 卡片示意预览辅色
}

export const TEMPLATES: Template[] = [
  {
    id: "wechat-avatar",
    name: "微信头像",
    audience: "大众",
    desc: "温馨可爱的个人头像",
    options: { type: "avatar", ratio: "1:1", style: "cute", scene: "studio", whitespace: "some" },
    subject: "一只微笑的橘色小猫",
    extra: "柔和光线，脸部特写",
    preview: "#FBEAF0",
    accent: "#ED93B1",
  },
  {
    id: "phone-wallpaper",
    name: "手机壁纸",
    audience: "大众",
    desc: "干净治愈的竖屏壁纸",
    options: { type: "wallpaper", ratio: "9:16", style: "minimal", scene: "nature", whitespace: "lots" },
    subject: "清晨山间的云海",
    extra: "低饱和色调，顶部留白",
    preview: "#E6F1FB",
    accent: "#85B7EB",
  },
  {
    id: "xiaohongshu-cover",
    name: "小红书封面",
    audience: "创作者",
    desc: "吸睛的竖版封面",
    options: { type: "poster", ratio: "3:4", style: "guochao", scene: "studio", whitespace: "lots" },
    subject: "国风美妆产品合集",
    extra: "上方留白用于放标题",
    preview: "#FAEEDA",
    accent: "#EF9F27",
  },
  {
    id: "gzh-header",
    name: "公众号头图",
    audience: "创作者",
    desc: "文艺风的横版头图",
    options: { type: "poster", ratio: "16:9", style: "flat", scene: "indoor", whitespace: "some" },
    subject: "午后阳光下的书桌与咖啡",
    extra: "插画感，暖色调",
    preview: "#EAF3DE",
    accent: "#97C459",
  },
  {
    id: "ecommerce-main",
    name: "电商商品主图",
    audience: "电商",
    desc: "干净的白色背景商品图",
    options: { type: "product", ratio: "1:1", style: "minimal", scene: "studio", whitespace: "some" },
    subject: "一款简约的陶瓷马克杯",
    extra: "商品居中，光影自然",
    preview: "#F1EFE8",
    accent: "#B4B2A9",
  },
  {
    id: "promo-poster",
    name: "促销海报",
    audience: "电商",
    desc: "突出商品的大促海报",
    options: { type: "poster", ratio: "3:4", style: "cinematic", scene: "studio", whitespace: "lots" },
    subject: "一瓶金色护肤精华",
    extra: "高级感暗调背景，下方留白放价格",
    preview: "#FAECE7",
    accent: "#F0997B",
  },
  {
    id: "ppt-image",
    name: "PPT 配图",
    audience: "职场",
    desc: "简洁大气的演示配图",
    options: { type: "illustration", ratio: "16:9", style: "minimal", scene: "none", whitespace: "none" },
    subject: "团队协作与城市天际线",
    extra: "扁平插画风格",
    preview: "#E1F5EE",
    accent: "#5DCAA5",
  },
  {
    id: "event-poster",
    name: "活动宣传海报",
    audience: "职场",
    desc: "科技感的活动主视觉",
    options: { type: "poster", ratio: "3:4", style: "futuristic", scene: "space", whitespace: "some" },
    subject: "科技峰会与蓝色星球",
    extra: "未来感，光效点缀",
    preview: "#EEEDFE",
    accent: "#AFA9EC",
  },
  {
    id: "birthday-card",
    name: "生日贺卡",
    audience: "大众",
    desc: "温柔水彩风的贺卡",
    options: { type: "poster", ratio: "3:4", style: "watercolor", scene: "nature", whitespace: "lots" },
    subject: "盛开的花束与蛋糕",
    extra: "顶部大面积留白用于写祝福语",
    preview: "#FBEAF0",
    accent: "#F4C0D1",
  },
  {
    id: "wechat-sticker",
    name: "微信表情包",
    audience: "创作者",
    desc: "搞怪可爱的聊天表情",
    options: { type: "sticker", ratio: "1:1", style: "anime", scene: "studio", whitespace: "none" },
    subject: "一只惊讶得张大嘴的白色小狗",
    extra: "线条简单，表情夸张",
    preview: "#FAEEDA",
    accent: "#FAC775",
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
