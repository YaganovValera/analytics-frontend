// src/pages/OfflineAnalysisPage.tsx
import { useState } from 'react';
import CsvUploader from '@components/CsvUploader';
import type { CSVParsedCandle, Candle } from '../../types/candle';
import api from '@api/axios';
import AnalysisChart from '@components/AnalysisChart';

function OfflineAnalysisPage() {
  const [candles, setCandles] = useState<CSVParsedCandle[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.post('/analyze-csv', candles);
      setResult(res.data);
    } catch {
      setError('Ошибка анализа CSV');
    } finally {
      setAnalyzing(false);
    }
  };

  const convertToProtoCandle = (c: CSVParsedCandle): Candle => ({
    symbol: c.symbol,
    open_time: { seconds: Math.floor(c.open_time.getTime() / 1000) },
    close_time: { seconds: Math.floor(c.close_time.getTime() / 1000) },
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
  });

  const parseServerCandle = (c: any): Candle => ({
    symbol: c.symbol,
    open_time: { seconds: Math.floor(new Date(c.open_time).getTime() / 1000) },
    close_time: { seconds: Math.floor(new Date(c.close_time).getTime() / 1000) },
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
    volume: c.volume,
  });

  return (
    <div>
      <h2>Анализ загруженного CSV</h2>
      <CsvUploader
        onParsed={(parsed: CSVParsedCandle[]) => {
          setCandles(parsed);
          setError(null);
        }}
        onError={(msg: string) => {
          setCandles([]);
          setError(msg);
        }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {candles.length > 0 && (
        <>
          <p>Загружено {candles.length} свечей.</p>
          <button onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? 'Анализируем...' : 'Проанализировать'}
          </button>
        </>
      )}

      {result?.analytics && (
        <div>
          <h3>График свечей</h3>
          <AnalysisChart
            key={result.symbol}
            candles={candles.map(convertToProtoCandle)}
            highlights={{
              maxGapUp: result.analytics.max_gap_up,
              maxGapDown: result.analytics.max_gap_down,
              mostVolatileCandle: parseServerCandle(result.analytics.most_volatile_candle),
              mostVolumeCandle: parseServerCandle(result.analytics.most_volume_candle),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default OfflineAnalysisPage;