import { db } from '../../config/firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  DocumentReference,
} from 'firebase/firestore';
import { Member } from '../../features/sales/Repositories';

const FILED_NAME = 'staff';

export const readMembers = async () => {
  const ref = doc(db, 'staff/member') as DocumentReference<{
    members: Member[];
  }>;
  return await getDoc(ref);
};

export const createMember = async (members: Member[]) => {
  const newMemberRef = doc(collection(db, FILED_NAME), 'member');
  return await setDoc(newMemberRef, {
    members: members,
  });
};
