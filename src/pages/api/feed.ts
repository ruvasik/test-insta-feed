import axios, {AxiosRequestConfig} from 'axios';

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

const PARAMS: AxiosRequestConfig = {
  method: 'GET',
  responseType: 'json',
  params: {
    access_token: process.env.IG_ACCESS_TOKEN,
    fields: 'media_count,media_type,permalink,media_url,caption',
    limit: 10
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  try {
    const resp = await axios.get('https://graph.instagram.com/me/media', PARAMS);

    const { data = [] } = resp?.data;

    res.status(200).json(data);
  }

  catch (e) {
    console.log(e);
    res.status(500).json({error: e?.message});
  }
}
