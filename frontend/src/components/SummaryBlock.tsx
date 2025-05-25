// src/components/SummaryBlock.tsx
import './SummaryBlock.css';

interface Props {
  summary: string;
}

function SummaryBlock({ summary }: Props) {
  return (
    <div className="summary-block">
      <h3>🧠 Сводка анализа</h3>
      <div className="summary-text">
        {summary.split('. ').map((part, idx) => (
          <p key={idx}>{part.trim().replace(/\.$/, '')}.</p>
        ))}
      </div>
    </div>
  );
}

export default SummaryBlock;