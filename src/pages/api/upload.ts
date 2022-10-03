import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';

type Data = {
  name: string
}

export const config = {
  api: {
    bodyParser: false,
  }
};

const getBufferData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const form = formidable({hashAlgorithm: 'sha1'});

      form.parse(req, (error, fields, files) => {
        if (error) {
          return resolve({ error });
        }

        return resolve({ fields, files });
      });
    }

    catch (e) {
      console.log('#6', e);
      reject(e);
    }
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const props = await getBufferData(req);

    res.status(200).json(props)
  }

  catch (e) {
    res.status(500).json({});
  }
}
