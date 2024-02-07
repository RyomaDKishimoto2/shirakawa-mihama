// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as admin from "firebase-admin";
import { cert, getApps } from "firebase-admin/app";

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
      const { uid } = req.body;

      // Firebase Admin SDKを使用してユーザーを作成
      await admin.auth().deleteUser(uid);
      res.status(200).json({ data: "ok" });
    } catch (error: any) {
      res
        .status(500)
        .json({ status: "500 Internal Server Error", error: error.message });
    }
  } else {
    // POST以外のメソッドは許可しない
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
