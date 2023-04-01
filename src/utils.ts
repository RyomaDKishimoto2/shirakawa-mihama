import { AttendanceType, ChangeLabelType, SalesType } from '../features/const';

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

export const isMembersEmpty = (members: AttendanceType[]): boolean => {
  return !members.length ? true : false;
};

export const isNumber = (data: number | undefined) => {
  return !data ? 0 : data;
};
