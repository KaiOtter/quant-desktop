import { describe, expect, it } from 'vitest';
import { computeMa, computeVwapSeries } from './minuteAux';

describe('computeVwapSeries', () => {
  it('空数据返回空数组', () => {
    expect(computeVwapSeries([])).toEqual([]);
  });

  it('量恒定时均价等于价格的简单平均', () => {
    const bars = [10, 20, 30].map((close) => ({ close, volume: 100 }));
    expect(computeVwapSeries(bars)).toEqual([10, 15, 20]);
  });

  it('成交量加权：量大的 bar 拉动均价更多', () => {
    const series = computeVwapSeries([
      { close: 10, volume: 3 },
      { close: 20, volume: 1 },
    ]);
    expect(series[1]).toBe(12.5);
  });

  it('零量 bar 不改变累计均价（线走平）', () => {
    expect(computeVwapSeries([
      { close: 10, volume: 100 },
      { close: 999, volume: 0 },
    ])).toEqual([10, 10]);
  });

  it('累计量还是 0 时为 null（集合竞价前）', () => {
    expect(computeVwapSeries([
      { close: 10, volume: 0 },
      { close: 20, volume: 100 },
    ])).toEqual([null, 20]);
  });
});

describe('computeMa', () => {
  it('取最近 n 个收盘价的均值', () => {
    expect(computeMa([1, 2, 3, 4, 5], 5)).toBe(3);
    expect(computeMa([1, 2, 3, 4, 5, 100], 5)).toBe(22.8);
  });

  it('历史不足 n 个（次新股）返回 null', () => {
    expect(computeMa([1, 2, 3], 5)).toBeNull();
    expect(computeMa([], 5)).toBeNull();
  });

  it('n 非法返回 null', () => {
    expect(computeMa([1, 2, 3], 0)).toBeNull();
  });
});
