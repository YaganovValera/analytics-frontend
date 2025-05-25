// src/components/AnalysisChart.tsx

import { useEffect, useRef } from 'react';
import {
  createChart,
  type UTCTimestamp,
  type CandlestickData,
  LineStyle,
} from 'lightweight-charts';
import type { Candle } from '../types/candle';

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

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;
    chartRef.current.innerHTML = '';

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#ccc',
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
      },
    });

    const series = chart.addCandlestickSeries();

    const chartData: CandlestickData[] = candles.map((c) => ({
      time: (c.open_time.seconds || 0) as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    series.setData(chartData);

    // Добавим линии на maxGapUp / maxGapDown
    if (highlights?.maxGapUp) {
      chart.addLineSeries({
        color: 'green',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
      }).setData(chartData.map((d) => ({ time: d.time, value: d.open + highlights.maxGapUp! })));
    }

    if (highlights?.maxGapDown) {
      chart.addLineSeries({
        color: 'red',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
      }).setData(chartData.map((d) => ({ time: d.time, value: d.open - highlights.maxGapDown! })));
    }

    // Удаление при размонтировании
    return () => chart.remove();
  }, [candles, highlights]);

  return <div ref={chartRef} style={{ marginBottom: '1rem' }} />;
}

export default AnalysisChart;