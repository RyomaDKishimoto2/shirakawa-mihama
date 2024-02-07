import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  CollectionReference,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export const RoleType = {
  ADMIN: "ADMIN",
  USER: "USER",
  ZEIRISHI: "ZEIRISHI",
} as const;
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export type User = {
  role: RoleType;
  userId: string;
  name?: string;
};

export const createUser = async (data: User) => {
  const ref = doc(db, `users/${data.userId}`);
  return await setDoc(ref, { ...data, createdAt: serverTimestamp() });
};

export const readUser = async ({ uid }: { uid: string }) => {
  const ref = doc(db, `users/${uid}`);
  return await getDoc(ref);
};

export const readUses = async () => {
  const col = collection(db, "users") as CollectionReference;
  const docs = await getDocs(col);
  return docs.docs.map((doc) => doc.data());
};

export const deleteUser = async ({ uid }: { uid: string }) => {
  const userRef = doc(collection(db, "users"), uid);
  await deleteDoc(userRef);
};
