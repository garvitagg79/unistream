import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await db.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name = "anonymous", email, username, externalUserId, imageUrl } = req.body 
    // Check for missing required fields
    if (!email || !username || !externalUserId) {
      return res.status(400).json({ error: "Missing required fields: email, username, or externalUserId" });
    }

    try {
      console.log("done");
      const user = await db.user.create({
        data: { name, email, username, externalUserId, imageUrl },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
