import { FC, useMemo } from 'react';
import { SaleInfoLabel } from './Label';
import { DaysType, MonthType } from '../features/const';
import { CashData, Sale, SaleData } from '../features/sales/Entities';
import {
  calcTotalMonthlyGuests,
  calculateTotalMonthlyLaborCost,
} from './SaleLabelSection';

const getFakeCash = (todaySale: CashData) => {
  return todaySale.cash - (todaySale.fakeCash || 0);
};

type Props = {
  currentDay: DaysType;
  todaySale: SaleData;
  monthlySales: Sale[];
};

// 11月平均売り上げ
const calcFakeAverageDailySales = ({
  currentDay,
  todaySale,
  monthlySales,
}: Props) => {
  const totalTodaySales =
    todaySale.card + todaySale.cash + todaySale.eMoney - getFakeCash(todaySale);
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
const calcFakeAverageDailyCustomerValue = (salesData: Sale) => {
  const totalDailySales =
    salesData.card + salesData.cash + salesData.eMoney - getFakeCash(salesData);
  const averageDailyCustomerValue =
    salesData.guests === 0 ? 0 : totalDailySales / salesData.guests;
  return averageDailyCustomerValue;
};

// 11月売上合計
const calcFakeTotalMonthlySales = ({
  currentDay,
  todaySale,
  monthlySales,
}: Props) => {
  const totalSalesToday =
    todaySale.card + todaySale.cash + todaySale.eMoney - getFakeCash(todaySale);
  const isTodayFirstDay = currentDay === 1;

  const totalSalesUntilYesterday = monthlySales
    .filter((sale) => sale.day < currentDay)
    .reduce((total, sale) => total + sale.total, 0);

  const totalMonthlySales = isTodayFirstDay
    ? totalSalesToday
    : totalSalesUntilYesterday + totalSalesToday;

  return totalMonthlySales;
};

type SaleLabelSectionProps = {
  currentDay: DaysType;
  todaySale: Sale;
  monthlySales: Sale[];
  month: MonthType;
};

export const FakeSaleLabelSection: FC<SaleLabelSectionProps> = ({
  currentDay,
  todaySale,
  monthlySales,
  month,
}) => {
  const aveMonthly = useMemo(
    () =>
      calcFakeAverageDailySales({
        currentDay,
        todaySale,
        monthlySales,
      }),
    [currentDay, todaySale, monthlySales]
  );

  const aveDayly = useMemo(
    () => calcFakeAverageDailyCustomerValue(todaySale),
    [monthlySales]
  );

  const totallyMonthly = useMemo(
    () =>
      calcFakeTotalMonthlySales({
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
        label={`${month}月来客数累計`}
      />
      <SaleInfoLabel
        value={totalMonthlyLabor}
        label={`${month}月人件費累計`}
        isSale={true}
      />
    </dl>
  );
};
