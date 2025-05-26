// src/components/orderbook/OrderBookForm.tsx
import { useEffect, useState } from 'react';
import { fetchSymbols } from '@api/candles';
import './OrderBookForm.css';

interface OrderBookFormProps {
  onSubmit: (params: {
    symbol: string;
    start: string;
    end: string;
    limit: number;
  }) => void;
  loading: boolean;
}

function OrderBookForm({ onSubmit, loading }: OrderBookFormProps) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [symbol, setSymbol] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [limit, setLimit] = useState(500);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSymbols()
      .then(setSymbols)
      .catch(() => setError('Не удалось загрузить список символов'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !start || !end || !limit) return setError('Заполните все поля');
    if (new Date(start) >= new Date(end)) return setError('Дата начала должна быть меньше даты окончания');
    if (limit < 1 || limit > 1000) return setError('Количество записей должно быть от 1 до 1000');
    setError(null);
    onSubmit({
      symbol,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      limit,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="orderbook-form">
      <h3>Фильтрация данных</h3>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Символ:</label>
        <select
          className="form-select"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        >
          <option value="">-- выберите --</option>
          {symbols.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Начало:</label>
        <input
          className="form-input"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Конец:</label>
        <input
          className="form-input"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Количество снимков (1–1000):</label>
        <input
          className="form-input"
          type="number"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          min={1}
          max={1000}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        Загрузить
      </button>
    </form>
  );
}

export default OrderBookForm;
