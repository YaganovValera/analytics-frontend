import './OrderBookMetrics.css';
import type { OrderBookAnalysis } from '../../types/orderbook';

interface OrderBookMetricsProps {
  analysis: OrderBookAnalysis;
}

const formatPercent = (value: number) => (value * 100).toFixed(4) + '%';
const formatFloat = (value: number) => value.toFixed(4);

function OrderBookMetrics({ analysis }: OrderBookMetricsProps) {
  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <h4>Средний спред</h4>
        <p>{formatPercent(analysis.avg_spread_percent)}</p>
      </div>

      <div className="metric-card">
        <h4>Средний объём BID (топ 10)</h4>
        <p>{formatFloat(analysis.avg_bid_volume_top10)}</p>
      </div>

      <div className="metric-card">
        <h4>Средний объём ASK (топ 10)</h4>
        <p>{formatFloat(analysis.avg_ask_volume_top10)}</p>
      </div>

      <div className="metric-card">
        <h4>Дисбаланс в начале</h4>
        <p>{formatFloat(analysis.imbalance_start)}</p>
      </div>

      <div className="metric-card">
        <h4>Дисбаланс в конце</h4>
        <p>{formatFloat(analysis.imbalance_end)}</p>
      </div>

      <div className="metric-card">
        <h4>Наклон BID</h4>
        <p>{formatFloat(analysis.bid_slope)}</p>
      </div>

      <div className="metric-card">
        <h4>Наклон ASK</h4>
        <p>{formatFloat(analysis.ask_slope)}</p>
      </div>

      <div className="metric-card">
        <h4>Макс. стена BID</h4>
        <p>
          {analysis.max_bid_wall_volume} @ {analysis.max_bid_wall_price}
        </p>
      </div>

      <div className="metric-card">
        <h4>Макс. стена ASK</h4>
        <p>
          {analysis.max_ask_wall_volume} @ {analysis.max_ask_wall_price}
        </p>
      </div>
    </div>
  );
}

export default OrderBookMetrics;
