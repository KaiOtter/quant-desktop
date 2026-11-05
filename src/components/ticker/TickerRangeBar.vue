<script setup lang="ts">
import { computed } from 'vue';
import { rangePosition, dayVwap } from '@/utils/rangeBar';
import { VWAP_COLOR } from '@/utils/minuteAux';
import { formatPrice } from '@/utils/format';

const props = defineProps<{
  /** 现价；null 时整个条不画 */
  price: number | null;
  /** 昨收（price - change），可能在当日区间外（跳空），画时钳制到端点 */
  prevClose: number | null;
  /** 当日最低/最高，构成轨道区间 */
  low: number;
  high: number;
  /** 当日成交额（元）/ 成交量（股），在组件内算分时均价；均价标随快照逐笔更新 */
  turnover: number | null;
  volume: number | null;
  /** 涨跌方向，决定现价点配色；null 用中性色 */
  up: boolean | null;
}>();

const vwapColor = VWAP_COLOR;

const pricePos = computed(() => rangePosition(props.price, props.low, props.high));
const prevPos = computed(() => rangePosition(props.prevClose, props.low, props.high));
const avgPrice = computed(() => dayVwap(props.turnover, props.volume));
const avgPos = computed(() => rangePosition(avgPrice.value, props.low, props.high));

/** 悬浮读数：高低区间 + 现价 + 均价。行情条高度小、没有坐标轴，读数靠这里。 */
const tooltip = computed(() => {
  const parts = [`低 ${formatPrice(props.low)} / 高 ${formatPrice(props.high)}`];
  if (props.price !== null) parts.push(`现价 ${formatPrice(props.price)}`);
  if (avgPrice.value !== null) parts.push(`均价 ${formatPrice(avgPrice.value)}`);
  return parts.join('，');
});
</script>

<template>
  <div class="range-bar" :title="tooltip" aria-hidden="true">
    <div class="range-track"></div>
    <div v-if="prevPos !== null" class="range-prev-close" :style="{ left: `${prevPos * 100}%` }"></div>
    <div v-if="avgPos !== null" class="range-avg" :style="{ left: `${avgPos * 100}%` }"></div>
    <div
      v-if="pricePos !== null"
      class="range-price"
      :class="up === null ? 'flat' : up ? 'up' : 'down'"
      :style="{ left: `${pricePos * 100}%` }"
    ></div>
  </div>
</template>

<style scoped>
.range-bar {
  /* 固定宽度而不是 flex 伸展：行内名称列优先保证可读，剩余宽度给区间条 */
  width: 64px;
  flex-shrink: 0;
  position: relative;
  height: 12px;
  /* 端点标记（0%/100% 处）以自身中心定位，左右各留半个标记的呼吸位 */
  margin: 0 3px;
}
.range-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  height: 3px;
  border-radius: var(--radius-full, 9999px);
  background: var(--color-border-1);
}
/* 昨收刻度：细竖线，中性色 —— 它只是基准，不能比现价点抢眼 */
.range-prev-close {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 8px;
  transform: translate(-50%, -50%);
  background: var(--color-text-tertiary);
}
/* 分时均价：橙色竖虚线，与主窗口分时图的 VWAP 均价线同色（#FF9500）。
   虚线用 border 而不是 background —— 1px 宽元素上 background 做不出虚线 */
.range-avg {
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  border-left: 1px dashed v-bind(vwapColor);
}
/* 现价：红/绿细竖线，贯穿整个条高 —— 它是主信息，视觉权重最高 */
.range-price {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1.5px;
  transform: translateX(-50%);
}
.range-price.up { background: var(--color-up); }
.range-price.down { background: var(--color-down); }
.range-price.flat { background: var(--color-text-tertiary); }
</style>
