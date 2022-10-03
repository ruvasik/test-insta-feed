import fs from 'fs';
import path from "path";
import axios, {AxiosRequestConfig} from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
}

const {IG_ACCESS_TOKEN, IG_JSON_DIR, IG_JSON_FILE} = process.env;
let FEED_UPDATE_INTERVAL = process.env.FEED_UPDATE_INTERVAL * 1000;
const JSON_FILE = path.resolve(process.cwd(), `${IG_JSON_DIR}${IG_JSON_FILE}`);

const PARAMS: AxiosRequestConfig = {
  method: 'GET',
  responseType: 'json',
  params: {
    access_token: IG_ACCESS_TOKEN,
    fields: 'media_count,media_type,permalink,media_url,caption,thumbnail_url,timestamp',
    limit: 10
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let data: Record<string, any> = {};
  let resp;
  let feed;

  try {
    const rawdata = fs.readFileSync(JSON_FILE);
    if (rawdata) {
      data = JSON.parse(rawdata);
      feed = data.feed;
    }

  } catch (e) {
    console.log('debug', e);
    res.status(500).json({error: e?.message});
  }

  // older 1 day
  if (data?.feed?.length && (Date.now() - data.updated) > FEED_UPDATE_INTERVAL)
    feed = [];

  try {
    if (!feed.length) {
      resp = await axios.get('https://graph.instagram.com/me/media', PARAMS);
      feed = resp?.data?.data || [];
      data.updated = Date.now();
    }
  }
  catch (e) {
    console.log('debug', e);
    res.status(500).json({error: e?.message});
  }

  if (feed) {
    data.feed = feed;
  }

  try {
    fs.writeFileSync( JSON_FILE, JSON.stringify(data) );
  } catch (e) {
    console.log('debug', e);
    res.status(500).json({error: e?.message});
  }

  res.status(200).json(data);
}
