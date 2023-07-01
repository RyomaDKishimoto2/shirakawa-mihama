import { NextPage } from 'next';
import ProtectedRoute from '../../components/ProtectedRoute';
import { DaysType, MonthType, YearType } from '../../features/const';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loading } from '../../components/loading';
import ja from 'date-fns/locale/ja';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router';
import { SaleRepository } from '../../features/sales/Repositories';
import useSWR from 'swr';
import { ArrowDownIcon } from '@heroicons/react/20/solid';
import { Sales } from '../../features/sales/Entities';
import { QuantityButton } from '../../components/QuantityButton';
import { SubmitButton } from '../../components/Submit';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '@/lib/user';
import AccessDeninedPage from './403';
import { calsFakeMonthlyTotal, createFakeCash } from '@/utils';

registerLocale('ja', ja);

export function Li({
  isUpdated,
  sales,
  setSales,
  setFakeTotal,
}: {
  isUpdated: boolean;
  sales: Sales;
  setSales: Dispatch<SetStateAction<Sales[]>>;
  setFakeTotal: Dispatch<SetStateAction<number>>;
}) {
  const [count, setCount] = useState<number>(
    sales.fakeCash ? sales.fakeCash / 10000 : 0
  );

  const [minus, setMinus] = useState<number>(
    isUpdated ? -createFakeCash({ sale: sales }) : count * -10000
  );

  useEffect(() => {
    setCount(sales.fakeCash ? sales.fakeCash / 10000 : 0);
    setMinus(isUpdated ? -createFakeCash({ sale: sales }) : count * -10000);
  }, [sales]);

  return (
    <li key={sales.day} className='px-3 py-3 rounded-lg mb-2 bg-white'>
      <div className='flex items-center space-x-4'>
        <div className='flex-shrink-0'>
          <div className='h-20 w-20 flex-none rounded-full bg-slate-100 flex justify-center items-center text-lg font-medium'>
            {sales.day}日({sales.dayOfWeek})
          </div>
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-xl leading-6 text-gray-900'>
            {sales.cash.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </p>
          <div className='flex items-center'>
            <ArrowDownIcon
              className='my-2 h-6 w-6 text-gray-500'
              aria-hidden='true'
            />
            {count >= 1 && (
              <span className='inline-flex items-center rounded-md bg-pink-50 mx-4 px-2 py-1 text-sm font-bold text-pink-700 ring-1 ring-inset ring-pink-700/10'>
                {minus.toLocaleString('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                })}
              </span>
            )}
          </div>
          <p className='text-xl font-semibold leading-6 text-gray-900'>
            {(sales.cash - count * 10000).toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </p>
        </div>
        <div className='flex flex-col'>
          <div className='my-2'>
            <QuantityButton
              isAdd={false}
              onClick={() => {
                if ((count + 1) * 10000 > sales.cash) {
                  return;
                }

                setFakeTotal((prev) => prev + 10000);
                setSales((s) =>
                  s.map((s) =>
                    s.day === sales.day
                      ? { ...s, fakeCash: (count + 1) * 10000 }
                      : s
                  )
                );
                setCount((prev) => prev + 1);
              }}
            />
          </div>
          <div className='my-2'>
            <QuantityButton
              isAdd={true}
              onClick={() => {
                if (count === 0 || (count - 1) * 10000 > sales.cash) {
                  return;
                }
                setFakeTotal((prev) => prev - 10000);
                setSales((s) =>
                  s.map((s) =>
                    s.day === sales.day
                      ? { ...s, fakeCash: (count - 1) * 10000 }
                      : s
                  )
                );
                setCount((prev) => prev - 1);
              }}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

const AdjustmentPage: NextPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const month = Number(router.query.month || now.getMonth() + 1) as MonthType;
  const day = Number(router.query.day || now.getDate()) as DaysType;
  const [startDate, setStartDate] = useState<Date>(
    new Date(`${year}/${month}/${day}`)
  );
  const handleChange = (date: Date) => {
    setStartDate(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    router.replace({
      query: {
        ...router.query,
        month,
      },
    });
  };
  const [sales, setSales] = useState<Sales[]>([]);
  const { data, mutate } = useSWR(
    year && month ? `/api/sales/${year}/${month}` : null,
    async () => {
      return await SaleRepository.getSales({ year, month });
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    }
  );
  const [fakeTotal, setFakeTotal] = useState<number>(
    data ? Math.abs(calsFakeMonthlyTotal({ sales: data })) : 0
  );
  const [isUpdated, setIsUpdate] = useState<boolean>(
    data ? data.some((d) => d.fakeCash) : false
  );

  const onSubmit = async () => {
    if (!isUpdated) {
      if (
        !window.confirm(
          '保存をすると税理士さんに公開されます\n本当に保存しますか？'
        )
      ) {
        return;
      }
    }
    try {
      setLoading(true);
      await Promise.all(
        sales.map(async (v) => {
          const dummy = await SaleRepository.updateFakeCash({
            year: v.year as YearType,
            month: v.month as MonthType,
            day: v.day,
            fakeCash: v.fakeCash,
          });
          return dummy;
        })
      );
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSales(data ? data : []);
    setStartDate(new Date(`${year}/${month}/${day}`));
    setIsUpdate(data ? data.some((d) => d.fakeCash) : false);
    setFakeTotal(data ? Math.abs(calsFakeMonthlyTotal({ sales: data })) : 0);
  }, [data]);

  useEffect(() => {
    mutate();
  }, [month]);

  if (!user || !data) {
    return (
      <ProtectedRoute>
        <Loading message={'読み込み中..'} />
      </ProtectedRoute>
    );
  }

  if (user.role !== RoleType.ADMIN) {
    return <AccessDeninedPage />;
  }

  return (
    <ProtectedRoute>
      {loading && <Loading message={'保存中..'} />}
      <div
        className={`isolate bg-white py-24 px-10 sm:py-32 lg:px-8 ${
          loading ? 'blur-sm' : ''
        }`}
      >
        <div className='grid grid-cols-5 gap-2 mx-auto max-w-3xl'>
          <div className='col-span-5 flex justify-center items-center'>
            <div className='relative inline-flex items-center text-center px-3'>
              <DatePicker
                locale={ja}
                className='p-2.5 border border-gray-400 rounded-md cursor-pointer text-3xl w-full'
                selected={startDate}
                onChange={handleChange}
                dateFormat='yyyy/MM'
                showMonthYearPicker
                showFullMonthYearPicker
              />
              <div className='absolute inline-flex items-center justify-center text-md font-bold bg-gray-900 text-white border-2 border-white rounded-full -bottom-5 right-5  px-3 py-1 w-fit'>
                月の売上を調整する
              </div>
            </div>
          </div>
        </div>

        <div className='px-3 py-4 mt-20 rounded-md bg-zinc-200 '>
          <div className='text-right text-3xl mb-3 text-red-700'>
            <span className='text-lg mr-2 text-black'>調整した金額</span>
            {fakeTotal.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </div>
          <ul
            className='divide-y divide-gray-200 overflow-auto'
            style={{ height: '35rem' }}
          >
            {sales
              .sort((a, b) => a.day - b.day)
              .map((d) => {
                return (
                  <Li
                    key={d.day}
                    isUpdated={isUpdated}
                    sales={d}
                    setSales={setSales}
                    setFakeTotal={setFakeTotal}
                  />
                );
              })}
          </ul>
        </div>
        <div className='text-center mt-16'>
          <SubmitButton title={'保存する'} onSubmit={onSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdjustmentPage;
