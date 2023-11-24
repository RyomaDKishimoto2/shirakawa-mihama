import { FC, useMemo } from 'react';
import { SaleInfoLabel } from './Label';
import { DaysType, MonthType } from '../features/const';
import { Sale, SaleData } from '../features/sales/Entities';

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
    <dl className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-y-16 lg:gap-x-8'>
      <SaleInfoLabel
        value={aveMonthly}
        label={`${month}月平均売上`}
      />
      <SaleInfoLabel
        value={aveDayly}
        label={`${month}/${todaySale.day}平均客単価`}
      />
      <SaleInfoLabel
        value={totallyMonthly}
        label={`${month}月売上累計`}
      />
      <SaleInfoLabel
        value={totallyGuests}
        label={`${month}月売上累計`}
      />
      <SaleInfoLabel
        value={totalMonthlyLabor}
        label={`${month}月人件費累計`}
        isSale={true}
      />
    </dl>
  );
};
