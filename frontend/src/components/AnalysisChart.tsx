import { useEffect, useRef } from 'react';
import {
  createChart,
  type UTCTimestamp,
  type CandlestickData,
  LineStyle,
  type IChartApi,
} from 'lightweight-charts';
import type { Candle } from '../types/candle';
import './AnalysisChart.css';

interface AnalysisChartProps {
  candles: Candle[];
  highlights?: {
    maxGapUp?: number;
    maxGapDown?: number;
    mostVolatileCandle?: Candle;
    mostVolumeCandle?: Candle;
  };
}

function AnalysisChart({ candles, highlights }: AnalysisChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    chartRef.current.innerHTML = '';

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#fff' },
        textColor: '#111',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      crosshair: { mode: 1 },
      timeScale: { timeVisible: true, borderColor: '#ccc' },
      rightPriceScale: { borderColor: '#ccc' },
    });

    chartInstance.current = chart;

    const candleSeries = chart.addCandlestickSeries();

    const chartData: CandlestickData[] = candles.map((c) => ({
      time: (c.open_time.seconds || 0) as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    candleSeries.setData(chartData);

    // maxGapUp линия
    if (highlights?.maxGapUp) {
      const lineUp = chart.addLineSeries({
        color: '#2e7d32',
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });
      lineUp.setData(
        chartData.map((d) => ({
          time: d.time,
          value: d.open + highlights.maxGapUp!,
        }))
      );
    }

    // maxGapDown линия
    if (highlights?.maxGapDown) {
      const lineDown = chart.addLineSeries({
        color: '#c62828',
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });
      lineDown.setData(
        chartData.map((d) => ({
          time: d.time,
          value: d.open - highlights.maxGapDown!,
        }))
      );
    }

    return () => chart.remove();
  }, [candles, highlights]);

  return (
    <div className="analysis-layout">
      <div className="chart-container">
        <p className="chart-description">
          Вы видите интерактивный свечной график с наложением аналитических уровней. Наведите курсор
          на свечу для детального анализа.
        </p>
        <div ref={chartRef} />
      </div>

      <div className="chart-legend">
        <h4>Обозначения</h4>
        <div className="legend-item">
          <span className="icon green">🔺</span>
          <span>Max Gap Up — максимальный скачок вверх после открытия</span>
        </div>
        <div className="legend-item">
          <span className="icon red">🔻</span>
          <span>Max Gap Down — максимальный провал вниз после открытия</span>
        </div>
        <div className="legend-item">
          <span className="icon purple">🟣</span>
          <span>Свеча с наибольшим объёмом (всплеск активности)</span>
        </div>
        <div className="legend-item">
          <span className="icon yellow">🟡</span>
          <span>Самая волатильная свеча — резкое движение рынка</span>
        </div>
      </div>
    </div>
  );
}

export default AnalysisChart;
