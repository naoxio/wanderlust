// api/select-region.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region } = req.body;

  if (req.method === 'POST') {
    // Set the selected region as a header cookie
    res.setHeader('Set-Cookie', `selectedRegion=${region}; Path=/`);

    res.status(200).json({ message: 'Selected region updated successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
