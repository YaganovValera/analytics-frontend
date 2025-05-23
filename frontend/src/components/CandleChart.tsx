// src/components/CandleChart.tsx
import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import type {
  Time,
  CandlestickData,
  IChartApi,
  CandlestickSeriesPartialOptions,
} from 'lightweight-charts';
import { CandlestickSeries } from 'lightweight-charts';

type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Props = {
  candles: Candle[];
};

const CandleChart = ({ candles }: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#222222',
      },
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#d1d4dc',
      },
      rightPriceScale: {
        borderColor: '#d1d4dc',
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    } satisfies CandlestickSeriesPartialOptions);

    series.setData(candles as CandlestickData[]);
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [candles]);

  return <div ref={chartContainerRef} style={{ width: '100%' }} />;
};

export default CandleChart;
