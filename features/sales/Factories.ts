import { SalesType } from '../const';
import { Members, Sales } from './Entities';
import { Member } from './Repositories';

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
      res.staffSalaries
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

export const MembersFactory = {
  createFromMemberResponse,
};
