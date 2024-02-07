import { FC, useMemo } from "react";
import { DaysType, MonthType } from "../features/const";
import { Sale, SaleData } from "../features/sales/Entities";
import {
  CurrencyYenIcon,
  UsersIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

type Props = {
  currentDay: DaysType;
  todaySale: SaleData;
  monthlySales: Sale[];
};

// 11月平均売り上げ
const calcAverageDailySales = ({
  currentDay,
  todaySale,
  monthlySales,
}: Props) => {
  const totalTodaySales = todaySale.card + todaySale.cash + todaySale.eMoney;
  const isTodayFirstDay = currentDay === 1;
  const totalSalesUntilYesterday = monthlySales
    .filter((sale) => sale.day < currentDay)
    .reduce((total, sale) => total + sale.total, 0);

  const averageSales = isTodayFirstDay
    ? totalTodaySales
    : (totalSalesUntilYesterday + totalTodaySales) / currentDay;

  return averageSales;
};

// 当月の客単価
const calcAverageDailyCustomerValue = (salesData: SaleData) => {
  const totalDailySales = salesData.card + salesData.cash + salesData.eMoney;
  const averageDailyCustomerValue =
    salesData.guests === 0 ? 0 : totalDailySales / salesData.guests;
  return averageDailyCustomerValue;
};

// 11月売上合計
const calcTotalMonthlySales = ({
  currentDay,
  todaySale,
  monthlySales,
}: Props) => {
  const totalSalesToday = todaySale.card + todaySale.cash + todaySale.eMoney;
  const isTodayFirstDay = currentDay === 1;

  const totalSalesUntilYesterday = monthlySales
    .filter((sale) => sale.day < currentDay)
    .reduce((total, sale) => total + sale.total, 0);

  const totalMonthlySales = isTodayFirstDay
    ? totalSalesToday
    : totalSalesUntilYesterday + totalSalesToday;

  return totalMonthlySales;
};

// 当月来客数合計
export const calcTotalMonthlyGuests = ({
  currentDaySales,
  monthlySales,
}: {
  currentDaySales: SaleData;
  monthlySales: Sale[];
}) => {
  const totalGuestsUntilYesterday = monthlySales
    .filter((sale) => sale.day < currentDaySales.day)
    .reduce((total, sale) => total + sale.guests, 0);

  const totalMonthlyGuests = totalGuestsUntilYesterday + currentDaySales.guests;
  return totalMonthlyGuests;
};

// 当月人件費合計
export const calculateTotalMonthlyLaborCost = ({
  currentDay,
  monthlySales,
  currentDayLaborCost,
}: {
  currentDay: number;
  monthlySales: Sale[];
  currentDayLaborCost: number;
}) => {
  const totalLaborCostUntilYesterday = monthlySales
    .filter((sale) => sale.day < currentDay)
    .reduce((total, sale) => total + sale.staffSalaries, 0);

  const totalMonthlyLaborCost =
    totalLaborCostUntilYesterday + currentDayLaborCost;

  return Number(totalMonthlyLaborCost);
};

type SaleLabelSectionProps = {
  currentDay: DaysType;
  todaySale: SaleData;
  monthlySales: Sale[];
  month: MonthType;
};

const SaleList: FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  isNumber?: boolean;
}> = ({ icon, title, value, isNumber = true }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-darker">
      <div>
        <h6 className="mb-1 text-xs font-medium leading-none tracking-wider text-gray-500 uppercase dark:text-primary-light">
          {title}
        </h6>
        <span className="text-xl font-semibold">
          {isNumber
            ? value.toLocaleString("ja-JP", {
                style: "currency",
                currency: "JPY",
              })
            : value + "人"}
        </span>
      </div>
      <div>{icon} </div>
    </div>
  );
};

export const SaleLabelSection: FC<SaleLabelSectionProps> = ({
  currentDay,
  todaySale,
  monthlySales,
  month,
}) => {
  const aveMonthly = useMemo(
    () =>
      calcAverageDailySales({
        currentDay,
        todaySale,
        monthlySales,
      }),
    [currentDay, todaySale, monthlySales]
  );

  const aveDayly = useMemo(
    () => calcAverageDailyCustomerValue(todaySale),
    [monthlySales]
  );

  const totallyMonthly = useMemo(
    () =>
      calcTotalMonthlySales({
        currentDay,
        todaySale,
        monthlySales,
      }),
    [currentDay, todaySale]
  );

  const totallyGuests = useMemo(
    () =>
      calcTotalMonthlyGuests({
        currentDaySales: todaySale,
        monthlySales: monthlySales,
      }),
    [todaySale, monthlySales]
  );

  const totalMonthlyLabor = useMemo(
    () =>
      calculateTotalMonthlyLaborCost({
        currentDay,
        monthlySales,
        currentDayLaborCost: todaySale.staffSalaries,
      }),
    [currentDay, todaySale]
  );

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
      <SaleList
        title={`${month}月平均売上`}
        value={aveMonthly}
        icon={
          <CurrencyYenIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        }
      />
      <SaleList
        title={`${month}/${todaySale.day}平均客単価`}
        value={aveDayly}
        icon={
          <UsersIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        }
      />
      <SaleList
        title={`${month}月売上累計`}
        value={totallyMonthly}
        icon={
          <ArrowTrendingUpIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        }
      />
      <SaleList
        title={`${month}月来客数累計`}
        value={totallyGuests}
        icon={
          <UserGroupIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        }
        isNumber={false}
      />
      <SaleList
        title={`${month}月人件費累計`}
        value={totalMonthlyLabor}
        icon={
          <UsersIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        }
      />
    </div>
  );
};
