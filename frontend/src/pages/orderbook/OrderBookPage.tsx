// src/pages/orderbook/OrderBookPage.tsx
import { useState } from 'react';
import OrderBookForm from '@components/orderbook/OrderBookForm';
import OrderBookSpreadChart from '@components/orderbook/OrderBookSpreadChart';
import type { OrderBookSnapshot } from '../../types/orderbook';
import { fetchOrderBookSnapshots } from '@api/orderbook';
// import './OrderBookPage.css';

function OrderBookPage() {
  const [snapshots, setSnapshots] = useState<OrderBookSnapshot[]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState<{
    symbol: string;
    start: string;
    end: string;
    limit: number;
  } | null>(null);
  const [visibleCount, setVisibleCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (params: typeof query) => {
    if (!params) return;
    setQuery(params);
    setSnapshots([]);
    setNextToken(undefined);
    setVisibleCount(100);
    setError(null);
    setLoading(true);

    try {
      const res = await fetchOrderBookSnapshots({
        ...params,
        pageSize: Math.min(params.limit, 500),
      });
      const data = res.snapshots ?? [];
      if (data.length === 0) {
        setSnapshots([]);
        setNextToken(undefined);
      } else {
        setSnapshots(deduplicate(data));
        setNextToken(res.next_page_token);
      }
    } catch {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!query || !nextToken) return;

    const already = snapshots.length;
    const remaining = query.limit - already;

    if (visibleCount < snapshots.length) {
      setVisibleCount(Math.min(visibleCount + 100, snapshots.length));
      return;
    }

    if (remaining <= 0) return;

    setLoading(true);
    try {
      const res = await fetchOrderBookSnapshots({
        ...query,
        pageSize: Math.min(500, remaining),
        pageToken: nextToken,
      });
      const newData = res.snapshots ?? [];
      if (newData.length > 0) {
        const combined = [...snapshots, ...newData];
        const unique = deduplicate(combined);
        setSnapshots(unique);
        setVisibleCount(Math.min(visibleCount + 100, unique.length));
        setNextToken(res.next_page_token);
      } else {
        setNextToken(undefined);
      }
    } catch {
      setError('Ошибка при подгрузке данных');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orderbook-layout">
      <div className="orderbook-main">
        <h2>История стакана заявок</h2>

        {snapshots.length > 0 && (
          <div style={{ margin: '1rem 0' }}>
            <OrderBookSpreadChart snapshots={snapshots.slice(0, visibleCount)} />
          </div>
        )}

        {!loading && snapshots.length === 0 && query && <p>Нет данных по выбранным параметрам.</p>}

        {visibleCount < Math.min(snapshots.length, query?.limit || 0) && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="load-more-button"
          >
            Загрузить ещё
          </button>
        )}
      </div>

      <div className="orderbook-sidebar">
        <OrderBookForm onSubmit={handleQuery} loading={loading} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

function deduplicate(snapshots: OrderBookSnapshot[]): OrderBookSnapshot[] {
  const seen = new Set<string>();
  return snapshots.filter((s) => {
    const key = `${s.symbol}-${s.timestamp}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default OrderBookPage;
