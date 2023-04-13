import { FC } from 'react';
import { SalesType } from '../features/const';

type Props = {
  day: number;
  sale: SalesType;
  sales: SalesType[];
};

export const MonthlyTbody: FC<Props> = ({ day, sale, sales }) => {
  const todaySale = sale.card + sale.cash + sale.eMoney; // 今日だけの売上
  const firstDaySale = day === 1 ? todaySale : null;
  const MTD = sales.filter((sa) => sa.day < day); // 当月の初めから今日現在まで
  const MTDS = MTD.reduce((accum, sale) => accum + sale.total, 0); // 当月の初めから今日現在までの売り上げ合計
  const avgDayly = sale.guests === 0 ? 0 : todaySale / sale.guests; // 日当たり客単価
  const avgMonthly = firstDaySale
    ? firstDaySale
    : (MTDS + todaySale) / (MTD.length + 1); // 月の1日あたりの平均売上
  const monthlyTotal = firstDaySale ? firstDaySale : MTDS + todaySale; // 当月売上合計
  const totalGuests =
    sales.reduce((accum, sale) => accum + sale.guests, 0) + sale.guests;
  return (
    <tbody>
      <tr className='border-b hover:bg-gray-50'>
        <td className='px-6 py-4 text-2xl'>
          {avgMonthly.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
          })}
        </td>
        <td className='px-6 py-4 text-2xl'>
          {avgDayly.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
          })}
        </td>
        <td className='px-6 py-4 text-2xl'>
          {monthlyTotal.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
          })}
        </td>
        <td className='px-6 py-4 text-2xl'>{totalGuests}人</td>
      </tr>
    </tbody>
  );
};
