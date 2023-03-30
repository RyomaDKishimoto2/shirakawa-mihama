import { SalesType } from '../const';
import { Sales } from './Entities';

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
