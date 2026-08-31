// 中国时区（东八区）日期工具
// 返回 YYYY-MM-DD，用于每日签到判断，避免服务器 UTC 时区导致跨天错乱
export function todayCN(): string {
  const now = new Date();
  const cn = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return cn.toISOString().slice(0, 10);
}
