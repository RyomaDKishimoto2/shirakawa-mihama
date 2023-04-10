import { db } from '../../config/firebase';
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  DocumentReference,
  CollectionReference,
} from 'firebase/firestore';
import { CreateMemberInput, Member } from '../../features/sales/Repositories';
import { HouryType } from '../../features/const';

const FILED_NAME = 'staff';
const INFO_FILED_NAME = 'STAFF_INFO';

export const readMembers = async () => {
  const ref = doc(db, 'staff/member') as DocumentReference<{
    members: Member[];
  }>;
  return await getDoc(ref);
};

export const readMembersByAdmin = async () => {
  const col = collection(
    db,
    INFO_FILED_NAME
  ) as CollectionReference<CreateMemberInput>;
  return await getDocs(col);
};

export const createNewMember = async (param: CreateMemberInput) => {
  const newMemberRef = doc(collection(db, INFO_FILED_NAME), `${param.name}`);
  return await setDoc(newMemberRef, param);
};

export const createMember = async (members: Member[]) => {
  const newMemberRef = doc(collection(db, FILED_NAME), 'member');
  return await setDoc(newMemberRef, {
    members: members,
  });
};

export const deleteMember = async (name: string) => {
  const newSalesRef = doc(collection(db, INFO_FILED_NAME), `${name}`);
  return await updateDoc(newSalesRef, { isDeleted: true });
};

export const updateSalary = async (name: string, salary: HouryType) => {
  const newSalesRef = doc(collection(db, INFO_FILED_NAME), `${name}`);
  return await updateDoc(newSalesRef, { salary: salary });
};
