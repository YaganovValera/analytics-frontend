// src/components/AnalysisChart.tsx
import { useEffect, useRef } from 'react';
import {
  createChart,
  type CandlestickData,
  type UTCTimestamp,
  LineStyle,
  type IChartApi,
} from 'lightweight-charts';
import type { Candle } from '../types/candle';
import './AnalysisChart.css';

interface Props {
  candles: Candle[];
  highlights: {
    maxGapUp: number;
    maxGapDown: number;
    mostVolatileCandle: Candle;
    mostVolumeCandle: Candle;
  };
}

function AnalysisChart({ candles, highlights }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    chartRef.current.innerHTML = '';

    const instance = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#fff' },
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: { timeVisible: true },
      crosshair: { mode: 1 },
    });

    chart.current = instance;

    const series = instance.addCandlestickSeries();

    const data: CandlestickData[] = candles.map((c) => ({
      time: c.open_time.seconds as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    series.setData(data);

    // GAP UP линия
    const lineUp = instance.addLineSeries({
      color: '#2e7d32', // зелёный
      lineStyle: LineStyle.Dashed,
      lineWidth: 1,
    });
    lineUp.setData(data.map(d => ({ time: d.time, value: d.open + highlights.maxGapUp })));

    // GAP DOWN линия
    const lineDown = instance.addLineSeries({
      color: '#c62828', // красный
      lineStyle: LineStyle.Dashed,
      lineWidth: 1,
    });
    lineDown.setData(data.map(d => ({ time: d.time, value: d.open - highlights.maxGapDown })));

    // Маркеры свечей
    series.setMarkers([
      {
        time: highlights.mostVolumeCandle.open_time.seconds as UTCTimestamp,
        position: 'aboveBar',
        color: '#7e57c2',
        shape: 'circle',
        text: 'Max Vol',
      },
      {
        time: highlights.mostVolatileCandle.open_time.seconds as UTCTimestamp,
        position: 'belowBar',
        color: '#fbc02d',
        shape: 'circle',
        text: 'Volatile',
      },
    ]);
    

    return () => instance.remove();
  }, [candles, highlights]);

  return (
    <div className="analysis-container">
      <div className="chart-block">
        <div ref={chartRef} className="chart-wrapper" />
      </div>
      <div className="legend-block">
        <h4>Обозначения</h4>
        <div className="legend-item">
          <span className="icon green">🔺</span>
          <span className="label">Max Gap Up</span>
          <span className="tooltip" title="Резкий скачок вверх после открытия. Может быть вызван новостями или ордерами.">❓</span>
        </div>
        <div className="legend-item">
          <span className="icon red">🔻</span>
          <span className="label">Max Gap Down</span>
          <span className="tooltip" title="Резкое падение после открытия. Часто свидетельствует о панике на рынке.">❓</span>
        </div>
        <div className="legend-item">
          <span className="icon purple">🟣</span>
          <span className="label">Макс. объём</span>
          <span className="tooltip" title="Свеча с наибольшим объёмом. Указывает на аномальную активность.">❓</span>
        </div>
        <div className="legend-item">
          <span className="icon yellow">🟡</span>
          <span className="label">Макс. волатильность</span>
          <span className="tooltip" title="Свеча с наибольшим разбросом между high и low. Признак нестабильности.">❓</span>
        </div>
      </div>
    </div>
  );
}

export default AnalysisChart;