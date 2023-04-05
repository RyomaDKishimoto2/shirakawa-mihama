import {
  MemberType,
  ChangeLabelType,
  SalesType,
  HOURS,
  MINUTES,
} from '../features/const';
import { Sales } from '../features/sales/Entities';
import { Member } from '../features/sales/Repositories';

export const isGuestsEmpty = (sales: SalesType): boolean => {
  return !sales.guests && (sales.cash || sales.card || sales.eMoney)
    ? true
    : false;
};

export const calculateChange = ({
  type,
  change,
}: {
  type: ChangeLabelType;
  change: number;
}): number => {
  return type === 'Ichiman'
    ? change * 10000
    : type === 'Gosen'
    ? change * 5000
    : type === 'Nisen'
    ? change * 2000
    : type === 'Sen'
    ? change * 1000
    : type === 'Gohyaku'
    ? change * 500
    : type === 'Hyaku'
    ? change * 100
    : type === 'Gojyu'
    ? change * 50
    : type === 'Jyu'
    ? change * 10
    : type === 'Go'
    ? change * 5
    : change * 1;
};

type calculateSalaryProps = {
  fromHour: number;
  fromMin: number;
  toHour: number;
  toMin: number;
  hourly: number;
};

export const calculateSalary = ({
  fromHour,
  fromMin,
  toHour,
  toMin,
  hourly,
}: calculateSalaryProps) => {
  const hourSalary = (toHour - fromHour) * hourly; // 19-18*1000=1000円
  const minResult = toMin - fromMin;
  let min;
  if (Math.abs(minResult) === 0) {
    min = 0;
  } else if (Math.abs(minResult) === 15) {
    min = hourly * 0.25;
  } else if (Math.abs(minResult) === 30) {
    min = hourly * 0.5;
  } else if (Math.abs(minResult) === 45) {
    min = hourly * 0.75;
  } else {
    min = hourly * minResult;
  }
  return minResult < 0 ? hourSalary - min : hourSalary + min;
};

export const isMembersEmpty = (members: MemberType[]): boolean => {
  return !members.length ? true : false;
};

export const isNumber = (data: number | undefined) => {
  return !data ? 0 : data;
};

export const createMembers = (
  sales: Sales | undefined,
  INIT_MEMBERS: Member[]
) => {
  return sales
    ? INIT_MEMBERS.map((mem) => {
        const onDuty = sales.members.find((member) => member.name === mem.name);
        return onDuty
          ? {
              name: onDuty.name,
              status: onDuty.status,
              fromHour: onDuty.fromHour,
              fromMin: onDuty.fromMin,
              toHour: onDuty.toHour,
              toMin: onDuty.toMin,
              hourly: onDuty.hourly,
              amount: onDuty.amount,
            }
          : {
              name: mem.name,
              status: '休み',
              fromHour: [...HOURS][0],
              fromMin: [...MINUTES][0],
              toHour: [...HOURS][0],
              toMin: [...MINUTES][0],
              hourly: mem.salary,
              amount: 0,
            };
      })
    : INIT_MEMBERS.map((mem) => {
        return {
          name: mem.name,
          status: '休み',
          fromHour: [...HOURS][0],
          fromMin: [...MINUTES][0],
          toHour: [...HOURS][0],
          toMin: [...MINUTES][0],
          hourly: mem.salary,
          amount: 0,
        };
      });
};
