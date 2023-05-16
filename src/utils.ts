import {
  MemberType,
  ChangeLabelType,
  SalesType,
  HOURS,
  MINUTES,
} from '../features/const';
import { Sales } from '../features/sales/Entities';
import { Member } from '../features/sales/Repositories';

export const isOptionalNameEmpty = (optional: {
  name: string;
  value: number;
}): boolean => {
  return optional.value && !optional.name ? true : false;
};

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

export const createMembers = ({
  sale,
  initMembers,
}: {
  sale: Sales | undefined;
  initMembers: Member[];
}): MemberType[] => {
  return sale && sale.members.length
    ? sale.members.map((member) => {
        return {
          name: member.name,
          status: member.status,
          fromHour: member.fromHour,
          fromMin: member.fromMin,
          toHour: member.toHour,
          toMin: member.toMin,
          hourly: member.hourly,
          amount: member.amount,
        };
      })
    : initMembers.map((member) => {
        return {
          name: member.name,
          status: '休み',
          fromHour: [...HOURS][0],
          fromMin: [...MINUTES][0],
          toHour: [...HOURS][0],
          toMin: [...MINUTES][0],
          hourly: member.salary,
          amount: 0,
        };
      });
};

export const createPassword = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const passBase = alphabet + alphabetUpper + numbers;
  const len = 8; // 8桁
  let password = '';
  for (var i = 0; i < len; i++) {
    password += passBase.charAt(Math.floor(Math.random() * passBase.length));
  }
  return password;
};

type Props = {
  day: number;
  sale: SalesType;
  sales: SalesType[];
};

export const calcAveMonthly = ({ day, sale, sales }: Props) => {
  const todaySale = sale.card + sale.cash + sale.eMoney; // 今日だけの売上
  const firstDaySale = day === 1 ? todaySale : null;
  const MTD = sales.filter((sa) => sa.day < day); // 当月の初めから今日現在まで
  const MTDS = MTD.reduce((accum, sale) => accum + sale.total, 0); // 当月の初めから今日現在までの売り上げ合計
  const avgMonthly = firstDaySale
    ? firstDaySale
    : (MTDS + todaySale) / (MTD.length + 1); // 月の1日あたりの平均売上
  return avgMonthly;
};

export const calcAveDayly = ({ sale }: { sale: SalesType }) => {
  const todaySale = sale.card + sale.cash + sale.eMoney; // 今日だけの売上
  const avgDayly = sale.guests === 0 ? 0 : todaySale / sale.guests; // 日当たり客単価
  return avgDayly;
};

export const calcTotalMonthly = ({ day, sale, sales }: Props) => {
  const todaySale = sale.card + sale.cash + sale.eMoney; // 今日だけの売上
  const firstDaySale = day === 1 ? todaySale : null;
  const MTD = sales.filter((sa) => sa.day < day); // 当月の初めから今日現在まで
  const MTDS = MTD.reduce((accum, sale) => accum + sale.total, 0); // 当月の初めから今日現在までの売り上げ合計
  const monthlyTotal = firstDaySale ? firstDaySale : MTDS + todaySale; // 当月売上合計
  return monthlyTotal;
};

export const calcTotalMonthlyGuests = ({
  sale,
  sales,
}: {
  sale: SalesType;
  sales: SalesType[];
}) => {
  const totalGuests =
    sales
      .filter((sa) => sa.day < sale.day)
      .reduce((accum, sale) => accum + sale.guests, 0) + sale.guests;

  return totalGuests;
};

export const calcTotalMonthlyLabor = ({
  day,
  sales,
  todayLabor,
}: {
  day: number;
  sales: SalesType[];
  todayLabor: number;
}) => {
  const totalCost =
    sales
      .filter((sa) => sa.day < day)
      .reduce((accum, sale) => accum + sale.staffSalaries, 0) + todayLabor;
  return Number(totalCost);
};

export const calcTotalSalary = ({
  name,
  sales,
}: {
  name: string;
  sales: SalesType[];
}) => {
  const salary = sales.flatMap((s) => {
    if (!Array.isArray(s.members)) {
      return [];
    }
    return s.members.filter((m) => m.name === name);
  });
  return salary.reduce((accum, sale) => accum + sale.amount, 0);
};

export const dateFormat = (date: Date): string => {
  date.setDate(date.getDate());
  const yyyy = date.getFullYear();
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  return yyyy + '-' + mm + '-' + dd;
};
