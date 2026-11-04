// src/utils/minuteAux.ts
//
// 分时图辅助线的纯计算：当日分时均价（VWAP）序列与 N 日线（日 K 收盘价 MA）。
// 输入就是图表正在渲染的同一份数据（分钟 bar / 日 K 收盘价），与显示端天然一致 ——
// 均价线随当日分钟数据逐根累计，N 日线复用 K 线图取数的日 K 序列，不新增数据源接口。

import type { KLineData } from 'klinecharts';

/** 分时均价指标单根 bar 的计算结果（vwap 为 null 表示尚无均价可言） */
export interface MinuteVwapResult {
  vwap: number | null;
}

/**
 * 分时均价线颜色：固定橙色，深浅主题都读得出（和昨收基准线写死中性灰同一思路）。
 * 设置页的开关行也用它画色块图例，改这里两处同步。
 */
export const VWAP_COLOR = '#FF9500';

/**
 * N 日线配色：固定三色，避开图上已有的颜色 —— 价格线是蓝、分时均价线是橙、
 * 昨收基准线是中性灰，所以取紫 / 青 / 品红。下标与 MA 周期一一对应（5/15/30）。
 * 设置页的开关行也用它画色块图例，改这里两处同步。
 */
export const MA_LINE_COLORS = ['#8B5CF6', '#06B6D4', '#EC4899'] as const;

/**
 * 当日分时均价序列：从开市起逐根累计 Σ(价 × 量) / Σ量（VWAP）。
 *
 * 成交量为 0 的 bar（临停等）不改变累计值，该位取当前均价（与上一位持平，线走平而不是断开）；
 * 累计量还是 0 时（集合竞价前）为 null，指标不画点。
 * 价取 bar 收盘价（数据源分钟 bar 只有一个价），分钟粒度下与接口给的 avg_price 差异可忽略。
 */
export function computeVwapSeries(
  bars: readonly Pick<KLineData, 'close' | 'volume'>[],
): Array<number | null> {
  let turnover = 0;
  let volume = 0;
  return bars.map((bar) => {
    const price = bar.close;
    const vol = bar.volume ?? 0;
    if (price != null && Number.isFinite(price) && vol > 0) {
      turnover += price * vol;
      volume += vol;
    }
    return volume > 0 ? turnover / volume : null;
  });
}

/**
 * 最近 n 个收盘价的简单移动平均（末位即最新）。
 * 历史不足 n 个（次新股）返回 null —— 调用方据此不画线，而不是画出失真的均值。
 */
export function computeMa(closes: readonly number[], n: number): number | null {
  if (n <= 0 || closes.length < n) return null;
  let sum = 0;
  for (let i = closes.length - n; i < closes.length; i++) {
    sum += closes[i];
  }
  return sum / n;
}
