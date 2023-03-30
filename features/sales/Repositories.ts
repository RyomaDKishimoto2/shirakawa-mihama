import axios from 'axios';
import {
  SupplierType,
  ChangeStateType,
  AttendanceType,
  DayOfWeekType,
  WeatherType,
  MonthType,
  YearType,
  SalesType,
} from '../const';
import { SalesFactory } from './Factories';
import {
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  collection,
  Firestore,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { createSale, readSales } from '@/lib/sales';

type GetSalesInput = {
  year: YearType;
  month: MonthType;
};

export type CreateSaleInput = {
  param: SalesType;
};

const getSales = async ({ year, month }: GetSalesInput) => {
  const docs = await readSales({ year, month });
  const docsData = docs.docs.map((doc) => doc.data());
  return SalesFactory.createFromResponse(docsData);
};

const create = async ({ param }: CreateSaleInput) => {
  return await createSale({ param });
};

export const SaleRepository = {
  getSales,
  create,
};
