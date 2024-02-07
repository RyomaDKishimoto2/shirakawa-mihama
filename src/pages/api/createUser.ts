// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import { cert, getApps } from "firebase-admin/app";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

if (!getApps()?.length) {
  admin.initializeApp({
    credential: cert(
      // 環境変数から認証情報を取得
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    ),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // リクエストからユーザー情報を取得
      const { email, password } = req.body;

      // Firebase Admin SDKを使用してユーザーを作成
      const userRecord: UserRecord = await admin.auth().createUser({
        email,
        password,
      });

      res.status(200).json({ userRecord });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // POST以外のメソッドは許可しない
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
