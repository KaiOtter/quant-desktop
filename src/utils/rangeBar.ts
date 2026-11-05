// rangeBar.ts — 行情条「日内区间位置条」的纯计算。
//
// 区间条用当日 [最低价, 最高价] 做轨道，现价点、昨收刻度、分时均价标
// 各自按价格映射到 [0,1] 位置。全部基于实时行情快照（Quote 自带
// open/high/low/turnover/volume），不需要任何额外请求。

/**
 * 把价格映射到 [low, high] 区间的 [0,1] 位置，越界钳制到轨道两端。
 *
 * - 价格为 null/NaN，或区间无效（high <= 0、high < low）时返回 null（不画）；
 * - high == low（一字涨停/跌停、无成交）时区间没有宽度，一律落在 50%。
 */
export function rangePosition(
  value: number | null | undefined,
  low: number,
  high: number,
): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  if (!(high > 0) || high < low) return null;
  if (high === low) return 0.5;
  const t = (value - low) / (high - low);
  return Math.min(1, Math.max(0, t));
}

/**
 * 当日分时均价（VWAP）= 累计成交额 / 累计成交量。
 * 两个字段都是 Quote 快照里的当日累计值（成交额单位元、成交量单位股，
 * 两个数据源适配器已归一），相除即得平均成交价，与主窗口分时图的
 * VWAP 指标同源。成交量为 0（停牌、盘前无成交）时返回 null。
 */
export function dayVwap(turnover: number | null | undefined, volume: number | null | undefined): number | null {
  if (!turnover || !volume || volume <= 0) return null;
  const v = turnover / volume;
  return Number.isFinite(v) && v > 0 ? v : null;
}
