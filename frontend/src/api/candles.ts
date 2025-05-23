// src/api/candles.ts
import api from './axios';

export type ProtobufTimestamp = { seconds: number };

export type Candle = {
  open_time: ProtobufTimestamp;
  close_time: ProtobufTimestamp;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type GetCandlesParams = {
  symbol: string;
  interval: string;
  start: string;
  end: string;
  page_token?: string;
  page_size?: number;
};

export type GetCandlesResponse = {
  candles: Candle[];
  next_page_token?: string;
};

export async function getCandles(params: GetCandlesParams): Promise<GetCandlesResponse> {
  const res = await api.get<GetCandlesResponse>('/candles', { params });
  return res.data;
}
