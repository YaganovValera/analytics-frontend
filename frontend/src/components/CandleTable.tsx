// src/components/CandleTable.tsx

import { useMemo } from 'react';
import type { Candle } from '../types/candle';
import './CandleTable.css';

interface CandleTableProps {
  candles: Candle[];
  visibleCount: number;
}

const HEADERS = [
  { key: 'id_candle', label: 'ID' },
  { key: 'open_time', label: 'Открытие' },
  { key: 'close_time', label: 'Закрытие' },
  { key: 'open', label: 'Open' },
  { key: 'high', label: 'High' },
  { key: 'low', label: 'Low' },
  { key: 'close', label: 'Close' },
  { key: 'volume', label: 'Объём' },
];

function CandleTable({ candles, visibleCount }: CandleTableProps) {
    const sorted = useMemo(() => {
      return [...candles].sort((a, b) => a.open_time.seconds - b.open_time.seconds);
    }, [candles]);
  
    const visible = sorted.slice(0, visibleCount);
  
    const formatTime = (ts: { seconds: number }) => {
      return new Date(ts.seconds * 1000).toLocaleString();
    };
  
    return (
      <div className="candle-table-wrapper">
        <h3>Свечи ({candles.length})</h3>
        <table className="candle-table">
          <thead>
            <tr>
              {HEADERS.map(({ key, label }) => (
                <th key={key}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((candle, idx) => {
              const rowClass =
                candle.close > candle.open ? 'row-up' : candle.close < candle.open ? 'row-down' : 'row-neutral';
              return (
                <tr key={`${candle.symbol}-${candle.open_time.seconds}-${idx}`} className={rowClass}>
                    <td>{idx+1}</td>
                    <td>{formatTime(candle.open_time)}</td>
                    <td>{formatTime(candle.close_time)}</td>
                    <td>{candle.open.toFixed(2)}</td>
                    <td>{candle.high.toFixed(2)}</td>
                    <td>{candle.low.toFixed(2)}</td>
                    <td>{candle.close.toFixed(2)}</td>
                    <td>{candle.volume.toFixed(2)}</td>
                    </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CandleTable;

