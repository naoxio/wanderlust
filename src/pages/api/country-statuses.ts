// api/update-country-status.ts
import { kv } from '@vercel/kv';
import { CountryStatus } from '@/interfaces/index';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const { iso_a2, status } = request.body as { iso_a2: string; status: string };
    const countryStatuses = await kv.get<CountryStatus[]>('countryStatuses') || [];
    const existingCountryIndex = countryStatuses.findIndex(
      (country) => country.iso_a2 === iso_a2
    );

    if (existingCountryIndex !== -1) {
      countryStatuses[existingCountryIndex].status = status;
    } else {
      countryStatuses.push({ iso_a2, status });
    }

    await kv.set('countryStatuses', countryStatuses);
    response.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating country status:', error);
    response.status(500).json({ message: 'Internal server error' });
  }
}
