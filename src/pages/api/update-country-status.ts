// pages/api/update-country-status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { iso_a2, status } = req.body;
      await kv.set(iso_a2, status);
      res.status(200).json({ message: 'Country status updated successfully' });
    } catch (error) {
      console.error('Error updating country status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}