// src/components/orderbook/OrderBookSpreadChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { OrderBookSnapshot } from '../../types/orderbook';

interface Props {
  snapshots: OrderBookSnapshot[];
}

function OrderBookSpreadChart({ snapshots }: Props) {
  const data = snapshots.map((s) => {
    const bestBid = s.bids.length > 0 ? Math.max(...s.bids.map(b => b.price)) : null;
    const bestAsk = s.asks.length > 0 ? Math.min(...s.asks.map(a => a.price)) : null;
    const spread = bestBid !== null && bestAsk !== null ? bestAsk - bestBid : null;

    return {
      time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      spread,
    };
  }).filter(d => d.spread !== null);

  return (
    <div className="spread-chart">
      <h4>📉 Спред (разница между лучшими ask и bid)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" interval="preserveStartEnd" />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip formatter={(value) => `${value} $`} />
          <Line type="monotone" dataKey="spread" stroke="#2e7d32" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrderBookSpreadChart;
