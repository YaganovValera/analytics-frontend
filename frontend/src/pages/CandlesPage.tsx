// src/pages/CandlesPage.tsx
import { useEffect, useState } from 'react';
import { getSymbols } from '@api/symbols';
import type { Candle as APICandle } from '@api/candles';
import CandleChart from '@components/CandleChart';
import type { Time } from 'lightweight-charts';
import { exportCandlesToCSV } from '../utils/exportCsv';
import { useCandlesQuery } from '../hooks/useCandlesQuery';

const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];
type ViewMode = 'table' | 'chart';
type SortKey = keyof APICandle;
type SortDirection = 'asc' | 'desc';

function CandlesPage() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState('');
  const [interval, setInterval] = useState('1m');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [limit, setLimit] = useState(500);
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortKey, setSortKey] = useState<SortKey>('open_time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const renderSortArrow = (key: SortKey) => {
    if (key !== sortKey) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const { candles, error, isLoading, hasMore, fetchCandles, fetchMore } = useCandlesQuery({
    symbol,
    interval,
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    limit,
  });

  const formatProtoDate = (ts: { seconds: number }): string =>
    new Date(ts.seconds * 1000).toLocaleString();

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
      .catch(() => console.error('Ошибка загрузки символов'));
  }, []);

  return (
    <div className="candles-page">
      <h2>Исторические свечи</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!symbol || !start || !end) return alert('Заполните все поля');
          if (new Date(start) >= new Date(end)) return alert('Начало должно быть раньше конца');
          fetchCandles();
        }}
      >
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

        <div>
          <label>Лимит: </label>
          <input type="number" min="1" max="1000" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
        </div>

        <div>
          <label>Вид: </label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value as ViewMode)}>
            <option value="chart">График</option>
            <option value="table">Таблица</option>
          </select>
        </div>

        <button type="submit">Получить</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>Загрузка...</p>}

      {candles.length === 0 && !isLoading && <p style={{ color: '#999' }}>Нет данных для отображения.</p>}

      {candles.length > 0 && (
        <>
          {viewMode === 'chart' ? (
            <CandleChart candles={candles.map(c => ({
              time: c.open_time.seconds as Time,
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
            }))} />
          ) : (
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
          )}

          {hasMore && (
            <button onClick={fetchMore}>Загрузить ещё</button>
          )}

          <button onClick={() => exportCandlesToCSV(symbol, candles)}>
            Экспорт в CSV
          </button>
        </>
      )}
    </div>
  );
}

export default CandlesPage;
