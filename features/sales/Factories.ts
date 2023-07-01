import { SalesType } from '../const';
import { Members, Sales, StaffInfo } from './Entities';
import { CreateMemberInput, Member } from './Repositories';

const createFromResponse = (responses: SalesType[]) => {
  return responses.map((res) => {
    return new Sales(
      res.cash,
      res.card,
      res.year,
      res.month,
      res.day,
      res.eMoney,
      res.guests,
      res.senbero,
      res.changes,
      res.members,
      res.dayOfWeek,
      res.weather,
      res.total,
      res.impression,
      res.suppliers,
      res.staffSalaries,
      res.optionals,
      res.fakeCash
    );
  });
};

export const SalesFactory = {
  createFromResponse,
};

const createFromMemberResponse = (response: Member[]) => {
  return response.map((res) => {
    return new Members(res.name, res.salary, res.createdAt);
  });
};

const createFromStaffInfoResponse = (response: CreateMemberInput[]) => {
  return response.map((res) => {
    return new StaffInfo(
      res.name,
      res.email,
      res.password,
      res.isDeleted,
      res.createdAt,
      res.salary
    );
  });
};

export const MembersFactory = {
  createFromMemberResponse,
  createFromStaffInfoResponse,
};
