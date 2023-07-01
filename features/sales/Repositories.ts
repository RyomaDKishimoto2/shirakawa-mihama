import { MonthType, YearType, SalesType, HouryType } from '../const';
import { MembersFactory, SalesFactory } from './Factories';
import {
  CreateFakeCashInput,
  createSale,
  readSales,
  createFakeCash,
} from '@/lib/sales';
import {
  createNewMember,
  readMembers,
  readMembersByAdmin,
  deleteMember,
  updateSalary,
} from '@/lib/member';

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

const updateFakeCash = async ({
  year,
  month,
  day,
  fakeCash,
}: CreateFakeCashInput) => {
  return await createFakeCash({ year, month, day, fakeCash });
};

export const SaleRepository = {
  getSales,
  create,
  updateFakeCash,
};

const getMembers = async () => {
  const docs = await readMembers();
  const docsData = docs.docs.map((doc) => doc.data());
  return MembersFactory.createFromMemberResponse(docsData);
};

export type Member = {
  name: string;
  salary: HouryType;
  createdAt: Date;
};

export type CreateMemberInput = {
  name: string;
  salary: HouryType;
  createdAt: Date;
  password: string;
  email: string;
  isDeleted: boolean;
};

const addNewMember = async (member: CreateMemberInput) => {
  return await createNewMember(member);
};

const getStaffs = async () => {
  const docs = await readMembersByAdmin();
  const docsData = docs.docs.map((doc) => doc.data());
  return MembersFactory.createFromStaffInfoResponse(docsData);
};

export const MemberRepository = {
  getMembers,
  getStaffs,
  addNewMember,
  deleteMember,
  updateSalary,
};
