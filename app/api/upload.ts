import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name } = req.body;
    const { data, error } = await supabase.from('models').insert([{ name }]);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ data });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
