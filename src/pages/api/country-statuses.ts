// api/country-statuses.ts
import { kv } from '@vercel/kv';
import { CountryStatus } from '@/interfaces/index';
import { NextApiRequest, NextApiResponse } from 'next';

 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const countryStatuses = await kv.get<CountryStatus[]>('countryStatuses');
    response.status(200).json(countryStatuses || []);
  } catch (error) {
    console.error('Error fetching country statuses:', error);
    response.status(200).json({ message: 'Internal server error' });
  }
}

