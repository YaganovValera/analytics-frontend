// src/components/BodyWickLineChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalyticsResponse } from '../../types/analytics';
import './BodyWickLineChart.css';

interface Props {
  analytics: AnalyticsResponse['analytics'];
}

function BodyWickLineChart({ analytics }: Props) {
  const data = [
    { name: 'Тело свечи', value: analytics.avg_body_size },
    { name: 'Верхняя тень', value: analytics.avg_upper_wick },
    { name: 'Нижняя тень', value: analytics.avg_lower_wick },
  ];

  return (
    <div className="body-wick-line-block">
      <h3>📉 Структура свечей (средние значения)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v: number) => v.toFixed(2)} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BodyWickLineChart;