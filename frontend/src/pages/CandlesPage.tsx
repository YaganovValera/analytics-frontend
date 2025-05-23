// src/pages/CandlesPage.tsx
import { useEffect, useState } from 'react';
import { getCandles } from '@api/candles';
import type { Candle } from '@api/candles';
import { getSymbols } from '@api/symbols';

const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];

type SortKey = keyof Candle;
type SortDirection = 'asc' | 'desc';

function CandlesPage() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState('');
  const [interval, setInterval] = useState('1m');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>('open_time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toRFC3339 = (local: string): string => {
    const date = new Date(local);
    return date.toISOString();
  };

  const formatProtoDate = (ts: { seconds: number }): string => {
    const ms = ts.seconds * 1000;
    return new Date(ms).toLocaleString();
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedCandles = [...candles].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === 'object' && 'seconds' in aVal) {
      return sortDirection === 'asc'
        ? aVal.seconds - (bVal as any).seconds
        : (bVal as any).seconds - aVal.seconds;
    }

    return sortDirection === 'asc'
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  useEffect(() => {
    getSymbols()
      .then(setSymbols)
      .catch(() => setError('Ошибка загрузки символов'));
  }, []);

  const handleFetch = async (isLoadMore = false) => {
    try {
      setError(null);

      if (!symbol || !start || !end) {
        setError('Заполните все поля');
        return;
      }

      if (!isLoadMore && new Date(start) >= new Date(end)) {
        setError('Начало должно быть раньше конца');
        return;
      }

      const result = await getCandles({
        symbol,
        interval,
        start: toRFC3339(start),
        end: toRFC3339(end),
        page_token: isLoadMore ? nextPageToken ?? undefined : undefined,
      });

      setCandles((prev) =>
        isLoadMore ? [...prev, ...result.candles] : result.candles
      );
      setNextPageToken(result.next_page_token ?? null);
    } catch (err) {
      setError('Ошибка при получении свечей');
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (key !== sortKey) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="candles-page">
      <h2>Исторические свечи</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleFetch(false); }}>
        <div>
          <label>Символ: </label>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} required>
            <option value="" disabled>Выберите</option>
            {symbols.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label>Интервал: </label>
          <select value={interval} onChange={(e) => setInterval(e.target.value)}>
            {intervals.map((iv) => <option key={iv} value={iv}>{iv}</option>)}
          </select>
        </div>

        <div>
          <label>Начало: </label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
        </div>

        <div>
          <label>Конец: </label>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </div>

        <button type="submit">Получить</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {candles.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('open_time')}>Время открытия {renderSortArrow('open_time')}</th>
                <th onClick={() => toggleSort('close_time')}>Время закрытия {renderSortArrow('close_time')}</th>
                <th onClick={() => toggleSort('open')}>Open {renderSortArrow('open')}</th>
                <th onClick={() => toggleSort('high')}>High {renderSortArrow('high')}</th>
                <th onClick={() => toggleSort('low')}>Low {renderSortArrow('low')}</th>
                <th onClick={() => toggleSort('close')}>Close {renderSortArrow('close')}</th>
                <th onClick={() => toggleSort('volume')}>Volume {renderSortArrow('volume')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedCandles.map((c, idx) => (
                <tr key={idx}>
                  <td>{formatProtoDate(c.open_time)}</td>
                  <td>{formatProtoDate(c.close_time)}</td>
                  <td>{c.open}</td>
                  <td>{c.high}</td>
                  <td>{c.low}</td>
                  <td>{c.close}</td>
                  <td>{c.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {nextPageToken && (
            <button onClick={() => handleFetch(true)}>Загрузить ещё</button>
          )}
        </>
      )}
    </div>
  );
}

export default CandlesPage;