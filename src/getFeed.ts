import path from "path";
import fs from "fs";
import axios, {AxiosRequestConfig} from "axios";

let FEED_UPDATE_INTERVAL: number = process.env.FEED_UPDATE_INTERVAL * 1000;
const {IG_ACCESS_TOKEN, IG_JSON_DIR, IG_JSON_FILE} = process.env;
const JSON_FILE = path.resolve(process.cwd(), `${IG_JSON_DIR}${IG_JSON_FILE}`);

const PARAMS: AxiosRequestConfig = {
  method: 'GET',
  responseType: 'json',
  params: {
    access_token: IG_ACCESS_TOKEN,
    fields: 'media_count,media_type,permalink,media_url,caption,thumbnail_url,timestamp',
    limit: 25
  },
};

export default async function handler() {

  let data: Record<string, any> = {};
  let resp;
  let feed = [];

  try {
    const rawdata = fs.readFileSync(JSON_FILE);
    if (rawdata) {
      data = JSON.parse(rawdata);
      feed = data.feed;
    }
  } catch (e) {
    console.log('debug', e);
  }

  if (feed?.length && (Date.now() - data.updated) > FEED_UPDATE_INTERVAL)
    return feed = [];

  try {
    if (!feed.length) {
      let counter = 0;
      resp = await axios.get('https://graph.instagram.com/me/media', PARAMS);

      resp?.data?.data.forEach(item => {
        if (counter < 10 && item.thumbnail_url) {
          feed.push(item)
          counter++;
        }
      });

      if (feed.length)
        data.updated = Date.now();
    }
  }
  catch (e) {
    console.log('debug', e);
    return {error: e?.message};
  }

  if (feed.length) {
    data.feed = feed;
  }

  try {
    if (feed.length)
      fs.writeFileSync( JSON_FILE, JSON.stringify(data) );
  } catch (e) {
    console.log('debug', e);
    return {error: e?.message};
  }

  return data;
}
