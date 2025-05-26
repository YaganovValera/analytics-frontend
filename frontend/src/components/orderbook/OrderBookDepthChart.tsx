import './OrderBookDepthChart.css';
import type { OrderBookSnapshot } from '../../types/orderbook';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Props {
  snapshot: OrderBookSnapshot;
}

function OrderBookDepthChart({ snapshot }: Props) {
  const bids = [...(snapshot.bids ?? [])].sort((a, b) => b.price - a.price);
  const asks = [...(snapshot.asks ?? [])].sort((a, b) => a.price - b.price);

  let cumulativeBid = 0;
  let cumulativeAsk = 0;
  const data: { price: number; bid: number | null; ask: number | null }[] = [];

  for (const b of bids) {
    cumulativeBid += b.quantity || 0;
    data.push({ price: b.price, bid: +cumulativeBid.toFixed(4), ask: null });
  }
  for (const a of asks) {
    cumulativeAsk += a.quantity || 0;
    data.push({ price: a.price, bid: null, ask: +cumulativeAsk.toFixed(4) });
  }

  const sortedData = data.sort((a, b) => a.price - b.price);

  return (
    <div className="depth-chart">
      <div className="depth-chart-header">
        <h3>Глубина стакана (по первому снимку)</h3>
        <p>Показано {bids.length} bid и {asks.length} ask уровней</p>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={sortedData} margin={{ top: 20, right: 40, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" tick={{ fontSize: 10 }} type="number" domain={['auto', 'auto']} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip formatter={(val: number) => val.toFixed(4)} labelFormatter={(label) => `Цена: ${label}`}/>
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ top: 0, right: 0 }}
            payload={[
              { id: 'bid', value: 'Bid накопленный объём', type: 'line', color: '#007bff' },
              { id: 'ask', value: 'Ask накопленный объём', type: 'line', color: '#dc3545' },
            ]}
          />
          <Line type="stepAfter" dataKey="bid" stroke="#007bff" strokeWidth={2} dot={false} />
          <Line type="stepAfter" dataKey="ask" stroke="#dc3545" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrderBookDepthChart;
