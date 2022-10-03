import type { NextApiRequest, NextApiResponse } from 'next';

import getLocalFeed from '../../getFeed';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let data;

  try {
    data = await getLocalFeed();
  }
  catch (e) {
    res.status(500).json({error: e?.message});
  }
  res.status(200).json(data);
}
