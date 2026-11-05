import { describe, it, expect } from 'vitest';
import { rangePosition, dayVwap } from './rangeBar';

describe('rangePosition', () => {
  it('映射区间中点', () => {
    expect(rangePosition(15, 10, 20)).toBe(0.5);
  });

  it('边界值落在 0 和 1', () => {
    expect(rangePosition(10, 10, 20)).toBe(0);
    expect(rangePosition(20, 10, 20)).toBe(1);
  });

  it('越界（跳空缺口）钳制到轨道两端', () => {
    expect(rangePosition(8, 10, 20)).toBe(0);
    expect(rangePosition(25, 10, 20)).toBe(1);
  });

  it('昨收在区间外也能画（钳制）', () => {
    // 高开高走：昨收 9，当日最低 10
    expect(rangePosition(9, 10, 20)).toBe(0);
  });

  it('一字板（high == low）落在 50%', () => {
    expect(rangePosition(10.5, 10.5, 10.5)).toBe(0.5);
  });

  it('区间无效或价格缺失返回 null', () => {
    expect(rangePosition(null, 10, 20)).toBeNull();
    expect(rangePosition(NaN, 10, 20)).toBeNull();
    expect(rangePosition(15, 10, 0)).toBeNull();
    expect(rangePosition(15, 20, 10)).toBeNull(); // high < low
  });
});

describe('dayVwap', () => {
  it('成交额 / 成交量 = 均价', () => {
    // 100 万股，均价 10.5 元 → 成交额 1050 万元
    expect(dayVwap(10_500_000, 1_000_000)).toBeCloseTo(10.5, 6);
  });

  it('零成交（停牌/盘前）返回 null', () => {
    expect(dayVwap(0, 0)).toBeNull();
    expect(dayVwap(1000, 0)).toBeNull();
    expect(dayVwap(null, null)).toBeNull();
  });
});
