import { MonthType, YearType, SalesType, HouryType } from '../const';
import { MembersFactory, SalesFactory } from './Factories';
import { createSale, readSales } from '@/lib/sales';
import {
  createMember,
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

export const SaleRepository = {
  getSales,
  create,
};

const getMembers = async () => {
  const memberSnapshot = await readMembers();
  if (memberSnapshot.exists()) {
    return MembersFactory.createFromMemberResponse(
      memberSnapshot.data().members
    );
  }
  return null;
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

const createMembers = async (members: Member[]) => {
  return await createMember(members);
};

const getStaffs = async () => {
  const docs = await readMembersByAdmin();
  const docsData = docs.docs.map((doc) => doc.data());
  return MembersFactory.createFromStaffInfoResponse(docsData);
};

export const MemberRepository = {
  getMembers,
  getStaffs,
  createMembers,
  addNewMember,
  deleteMember,
  updateSalary,
};
