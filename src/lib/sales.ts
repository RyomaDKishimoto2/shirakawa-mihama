import { YearType, MonthType, SalesType } from '../../features/const';
import {
  doc,
  setDoc,
  getDocs,
  collection,
  CollectionReference,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { CreateSaleInput } from '../../features/sales/Repositories';

type GetSalesInput = {
  year: YearType;
  month: MonthType;
};

export const readSales = async (date: GetSalesInput) => {
  const COLLECTION_NAME = `${date.year}年${date.month}月`;
  const col = collection(db, COLLECTION_NAME) as CollectionReference<SalesType>;
  return await getDocs(col);
};

export const createSale = async ({ param }: CreateSaleInput) => {
  const FILED_NAME = `${param.year}年${param.month}月`;
  const newSalesRef = doc(collection(db, FILED_NAME), `${param.day}日`);
  return await setDoc(newSalesRef, param);
};
