import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export const config = {
  api: {
    bodyParser: false,
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const props = {}

    res.status(200).json(props)
  }

  catch (e) {
    res.status(500).json({});
  }
}
