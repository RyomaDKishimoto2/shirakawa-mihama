import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithCustomToken,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import type { Liff } from '@line/liff';
import { readUser, RoleType } from '@/lib/user';

interface UserType {
  userId: string | null;
  role: RoleType | null;
}

// liff関連のlocalStorageのキーのリストを取得
const getLiffLocalStorageKeys = (prefix: string) => {
  const keys = [];
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.indexOf(prefix) === 0) {
      keys.push(key);
    }
  }
  return keys;
};
// 期限切れのIDTokenをクリアする
const clearExpiredIdToken = (liffId: string) => {
  const keyPrefix = `LIFF_STORE:${liffId}:`;
  const key = keyPrefix + 'decodedIDToken';
  const decodedIDTokenString = localStorage.getItem(key);
  if (!decodedIDTokenString) {
    return;
  }
  const decodedIDToken = JSON.parse(decodedIDTokenString);
  // 有効期限をチェック
  if (new Date().getTime() > decodedIDToken.exp * 1000) {
    const keys = getLiffLocalStorageKeys(keyPrefix);
    keys.forEach(function (key) {
      localStorage.removeItem(key);
    });
  }
};

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
  children,
  liff,
}: {
  children: React.ReactNode;
  liff: Liff | null;
}) => {
  const [user, setUser] = useState<UserType>({ userId: null, role: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await readUser({ uid: user.uid });
        const userInfo = snap.data();
        if (userInfo) {
          setUser({
            userId: userInfo.userId,
            role: userInfo.role,
          });
        } else {
          setUser({ userId: null, role: null });
        }
      } else {
        setUser({ userId: null, role: null });
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if ((!user && !liff) || (liff && !liff.isLoggedIn())) {
      setUser({ userId: null, role: null });
    }
  }, [liff]);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    setUser({ userId: null, role: null });
    await signOut(auth);
  };

  const liffSignUp = async () => {
    if (!liff || !liff.id) {
      return;
    }
    clearExpiredIdToken(liff.id);
    await liff.init({ liffId: liff.id });
    try {
      const result = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: liff.getIDToken(),
        }),
      });
      const data = await result.json();
      return await signInWithCustomToken(auth, data.token);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut, liffSignUp }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
