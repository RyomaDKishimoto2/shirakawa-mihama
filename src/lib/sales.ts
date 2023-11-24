import { YearType, MonthType, SalesType, DaysType } from '../../features/const';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  CollectionReference,
} from 'firebase/firestore';
import { db } from '../../config/firebase';

type GetSalesInput = {
  year: YearType;
  month: MonthType;
};

export type CreateFakeCashInput = {
  year: YearType;
  month: MonthType;
  day: DaysType;
  fakeCash: number;
};

export const readSales = async (date: GetSalesInput) => {
  const COLLECTION_NAME = `${date.year}年${date.month}月`;
  const col = collection(db, COLLECTION_NAME) as CollectionReference<SalesType>;
  return await getDocs(col);
};

export const createSale = async (param: SalesType) => {
  const FILED_NAME = `${param.year}年${param.month}月`;
  const newSalesRef = doc(collection(db, FILED_NAME), `${param.day}日`);
  return await setDoc(newSalesRef, param);
};
