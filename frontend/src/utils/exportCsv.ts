// src/utils/exportCsv.ts
export type ProtobufTimestamp = { seconds: number };

export type Candle = {
  open_time: ProtobufTimestamp;
  close_time: ProtobufTimestamp;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function exportCandlesToCSV(symbol: string, candles: Candle[]): void {
  if (!candles.length) {
    alert('Нет данных для экспорта');
    return;
  }

  const headers = [
    'open_time',
    'close_time',
    'symbol',
    'open',
    'high',
    'low',
    'close',
    'volume',
  ];

  const rows = candles.map(c => [
    new Date(c.open_time.seconds * 1000).toISOString(),
    new Date(c.close_time.seconds * 1000).toISOString(),
    c.symbol,
    c.open,
    c.high,
    c.low,
    c.close,
    c.volume,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(val =>
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const fileName = `${symbol}_candles_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  link.click();
}
