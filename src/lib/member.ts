import { db } from "../../config/firebase";
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  CollectionReference,
} from "firebase/firestore";
import { CreateMemberInput, Member } from "../../features/sales/Repositories";

const INFO_FILED_NAME = "STAFF_INFO";
const MINIMAM_INFO_FILED_NAME = "STAFF_MINIMAM_INFO";

export const readMembers = async () => {
  const col = collection(
    db,
    MINIMAM_INFO_FILED_NAME
  ) as CollectionReference<Member>;
  return await getDocs(col);
};

export const readMembersByAdmin = async () => {
  const col = collection(
    db,
    INFO_FILED_NAME
  ) as CollectionReference<CreateMemberInput>;
  return await getDocs(col);
};

export const createNewMember = async (param: CreateMemberInput) => {
  const staffInfoRef = doc(collection(db, INFO_FILED_NAME), `${param.name}`);
  const staffMinimamInfoRef = doc(
    collection(db, MINIMAM_INFO_FILED_NAME),
    `${param.name}`
  );
  await setDoc(staffMinimamInfoRef, {
    name: param.name,
    createdAt: param.createdAt,
    salary: param.salary,
  });
  await setDoc(staffInfoRef, param);
  return;
};

export const deleteMember = async (name: string) => {
  const ref = doc(collection(db, INFO_FILED_NAME), `${name}`);
  const memberRef = doc(collection(db, MINIMAM_INFO_FILED_NAME), `${name}`);
  await deleteDoc(ref);
  await deleteDoc(memberRef);
};

export const updateSalary = async (name: string, salary: number) => {
  const newSalesRef = doc(collection(db, INFO_FILED_NAME), `${name}`);
  const staffMinimamInfoRef = doc(
    collection(db, MINIMAM_INFO_FILED_NAME),
    `${name}`
  );
  await updateDoc(staffMinimamInfoRef, { salary: salary });
  await updateDoc(newSalesRef, { salary: salary });
  return;
};
