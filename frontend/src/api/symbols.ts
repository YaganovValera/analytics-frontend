// src/api/symbols.ts
import api from './axios';

export async function getSymbols(): Promise<string[]> {
  const res = await api.get<{ symbols: string[] }>('/symbols');
  return res.data.symbols;
}
