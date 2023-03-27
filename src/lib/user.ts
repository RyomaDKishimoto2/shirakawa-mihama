import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const RoleType = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type RoleType = typeof RoleType[keyof typeof RoleType];

export type User = {
  role: RoleType;
  userId: string;
};

export const createUser = async (data: User) => {
  const ref = doc(db, `users/${data.userId}`);
  return await setDoc(ref, { ...data, createdAt: serverTimestamp() });
};

export const readUser = async ({ uid }: { uid: string }) => {
  const ref = doc(db, `users/${uid}`);
  return await getDoc(ref);
};
