import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { readUser, RoleType } from "@/lib/user";

type UserType = {
  userId: string | null;
  role: RoleType | null;
} | null;

const AuthContext = createContext({});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType>();
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
        setUser(null);
      }
    });
    setLoading(false);
    return () => unsubscribe();
  }, []);

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

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, logOut }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
