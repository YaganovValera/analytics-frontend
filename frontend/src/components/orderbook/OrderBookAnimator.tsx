import './OrderBookAnimator.css';
import { useState } from 'react';
import type { OrderBookSnapshot } from '../../types/orderbook';
import OrderBookDepthChart from './OrderBookDepthChart';

interface Props {
  snapshots: OrderBookSnapshot[];
}

function OrderBookAnimator({ snapshots }: Props) {
  const [index, setIndex] = useState(0);
  const total = snapshots.length;

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleNext = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  return (
    <div className="orderbook-animator">
      <div className="orderbook-animator-header">
        <h3>Анимация стакана заявок</h3>
        <p>Кадр {index + 1} из {total}</p>
      </div>

      <OrderBookDepthChart snapshot={snapshots[index]} />

      <div className="orderbook-animator-controls">
        <button onClick={handlePrev} disabled={index === 0}>← Назад</button>
        <button onClick={handleNext} disabled={index === total - 1}>Вперёд →</button>
      </div>
    </div>
  );
}

export default OrderBookAnimator;
