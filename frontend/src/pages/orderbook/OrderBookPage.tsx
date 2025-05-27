import { useState } from 'react';
import './OrderBookPage.css';
import OrderBookForm from '@components/orderbook/OrderBookForm';
import OrderBookMetrics from '@components/orderbook/OrderBookMetrics';
import OrderBookSpreadChart from '@components/orderbook/OrderBookSpreadChart';
import OrderBookDepthChart from '@components/orderbook/OrderBookDepthChart';
import OrderBookLevelTable from '@components/orderbook/OrderBookLevelTable';
import OrderBookAnimator from '@components/orderbook/OrderBookAnimator';
import { fetchOrderBook } from '@api/orderbook';
import type { OrderBookSnapshot, OrderBookAnalysis } from '../../types/orderbook';
import OrderBookSummary from '@components/orderbook/OrderBookSummary';

function OrderBookPage() {
  const [analysis, setAnalysis] = useState<OrderBookAnalysis | null>(null);
  const [snapshots, setSnapshots] = useState<OrderBookSnapshot[]>([]);
  const [query, setQuery] = useState<{
    symbol: string;
    start: string;
    end: string;
    pageSize: number;
  } | null>(null);
  const [pageTokens, setPageTokens] = useState<string[]>(['']);
  const [pageIndex, setPageIndex] = useState(0);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);

  const handleQuery = async (params: {
    symbol: string;
    start: string;
    end: string;
    pageSize: number;
  }) => {
    setError(null);
    setLoading(true);
    setNoData(false);
    setQuery(params);
    setPageTokens(['']);
    setPageIndex(0);
    try {
      const res = await fetchOrderBook({ ...params });
      const snaps = res.snapshots ?? [];
      setAnalysis(res.analysis);
      setSnapshots(snaps);
      setNextToken(res.next_page_token);
      if (snaps.length === 0) {
        setNoData(true);
      }
    } catch {
      setError('Ошибка загрузки данных');
      setSnapshots([]);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (index: number) => {
    if (!query || index < 0 || index >= pageTokens.length) return;
    setLoading(true);
    try {
      const token = pageTokens[index];
      const res = await fetchOrderBook({ ...query, pageToken: token });
      const snaps = res.snapshots ?? [];
      setSnapshots(snaps);
      setAnalysis(res.analysis);
      setNextToken(res.next_page_token);
      setPageIndex(index);
      setNoData(snaps.length === 0);
    } catch {
      setError('Ошибка при загрузке страницы данных');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadNext = async () => {
    if (!query || !nextToken) return;
    const newTokens = [...pageTokens];
    newTokens[pageIndex + 1] = nextToken;
    setPageTokens(newTokens);
    await loadPage(pageIndex + 1);
  };

  const handleLoadPrev = async () => {
    if (pageIndex > 0) {
      await loadPage(pageIndex - 1);
    }
  };

  return (
    <div className="orderbook-layout">
      <div className="orderbook-content">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {noData && <p>Нет данных в выбранном диапазоне</p>}
        {analysis && <OrderBookMetrics analysis={analysis} />}
        {analysis && <OrderBookSummary analysis={analysis} />}
        {snapshots.length > 0 && (
          <>
            <OrderBookSpreadChart snapshots={snapshots} />
            <OrderBookDepthChart snapshot={snapshots[0]} />
            <OrderBookLevelTable snapshot={snapshots[0]} />
            <OrderBookAnimator snapshots={snapshots} />
            <div className="orderbook-pagination">
              <button onClick={handleLoadPrev} disabled={loading || pageIndex === 0}>
                ← Предыдущие
              </button>
              {nextToken && (
                <button onClick={handleLoadNext} disabled={loading}>
                  {loading ? 'Загрузка...' : 'Следующие →'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <div className="orderbook-sidebar">
        <OrderBookForm onSubmit={handleQuery} loading={loading} />
      </div>
    </div>
  );
}

export default OrderBookPage;