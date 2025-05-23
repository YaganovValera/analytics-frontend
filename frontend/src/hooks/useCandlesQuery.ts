// src/hooks/useCandlesQuery.ts
import { useState } from 'react';
import { getCandles } from '@api/candles';
import type { Candle } from '@api/candles';

interface Params {
  symbol: string;
  interval: string;
  start: string;
  end: string;
  limit: number;
}

export function useCandlesQuery({ symbol, interval, start, end, limit }: Params) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchCandles = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCandles({
        symbol,
        interval,
        start,
        end,
        page_size: limit,
      });
      setCandles(result.candles);
      setNextPageToken(result.next_page_token ?? null);
    } catch (e) {
      setError('Ошибка загрузки свечей');
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = async () => {
    if (!nextPageToken) return;
    setLoading(true);
    try {
      const result = await getCandles({
        symbol,
        interval,
        start,
        end,
        page_size: limit,
        page_token: nextPageToken,
      });
      setCandles(prev => [...prev, ...result.candles]);
      setNextPageToken(result.next_page_token ?? null);
    } catch (e) {
      setError('Ошибка при дозагрузке свечей');
    } finally {
      setLoading(false);
    }
  };

  return {
    candles,
    error,
    isLoading,
    hasMore: !!nextPageToken,
    fetchCandles,
    fetchMore,
  };
}
