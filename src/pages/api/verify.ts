import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { cert, getApps } from 'firebase-admin/app';

if (!getApps()?.length) {
  admin.initializeApp({
    credential: cert(
      // 環境変数から認証情報を取得
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  });
}

const axiosInstance = axios.create({
  baseURL: 'https://api.line.me',
  responseType: 'json',
});

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const idToken = req.body.idToken;
  // id tokenの有効性を検証する
  const response = await axiosInstance.post(
    '/oauth2/v2.1/verify',
    {
      id_token: idToken,
      client_id: process.env.LIFF_CHANNEL_ID,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  if (response.status !== 200) {
    res.status(response.status).send(response.statusText);
    return;
  }
  // LINE IDでfirebaseトークンを発行して返却
  const token = await admin.auth().createCustomToken(response.data.sub);
  res.status(200).send({ token });
}
