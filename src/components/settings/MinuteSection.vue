<script setup lang="ts">
// 分时图：分时均价线与 N 日线参考线的开关。
// 这些线全部本地计算 —— 均价线用当日分钟数据累计（VWAP），
// N 日线用日 K 收盘价均值画成水平参考线，不新增数据源接口。
import { NSwitch } from 'naive-ui';
import { useSettingsStore } from '@/stores/settings';
import { MA_LINE_COLORS, VWAP_COLOR } from '@/utils/minuteAux';
import SettingsRow from './SettingsRow.vue';

const settings = useSettingsStore();
</script>

<template>
  <section class="panel">
    <p class="panel-hint">
      分时图上叠加的参考线。均价线随当日分钟数据逐点累计；N 日线是最近 N 个
      交易日收盘价的均值，画为水平参考线（同花顺/通达信的同款做法）。
    </p>

    <div class="card">
      <div class="card-body">
        <SettingsRow
          title="分时均价线"
          description="当日成交的加权平均价（VWAP），随交易逐点累计，判断股价相对全天成本的高低"
          :swatch="VWAP_COLOR"
        >
          <NSwitch
            size="small"
            :value="settings.minuteAvgLine"
            aria-label="分时均价线"
            @update:value="settings.setMinuteAvgLine"
          />
        </SettingsRow>

        <SettingsRow
          title="5日线"
          description="最近 5 个交易日的日 K 收盘价均值，水平参考线"
          :swatch="MA_LINE_COLORS[0]"
        >
          <NSwitch
            size="small"
            :value="settings.minuteMa5"
            aria-label="5日线"
            @update:value="settings.setMinuteMa5"
          />
        </SettingsRow>

        <SettingsRow
          title="15日线"
          description="最近 15 个交易日的日 K 收盘价均值，水平参考线"
          :swatch="MA_LINE_COLORS[1]"
        >
          <NSwitch
            size="small"
            :value="settings.minuteMa15"
            aria-label="15日线"
            @update:value="settings.setMinuteMa15"
          />
        </SettingsRow>

        <SettingsRow
          title="30日线"
          description="最近 30 个交易日的日 K 收盘价均值，水平参考线"
          :swatch="MA_LINE_COLORS[2]"
        >
          <NSwitch
            size="small"
            :value="settings.minuteMa30"
            aria-label="30日线"
            @update:value="settings.setMinuteMa30"
          />
        </SettingsRow>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 无分区独有样式 —— 卡片与行布局都在 assets/styles/settings.css。 */
</style>
