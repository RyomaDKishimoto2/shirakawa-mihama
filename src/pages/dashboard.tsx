import ProtectedRoute from '../../components/ProtectedRoute';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  MonthType,
  weekItems,
  YearType,
  MONTHS,
  DAYS,
  WEATHERS,
  WeatherType,
  SalesType,
  SALE_INIT_VALUE,
  SUPPLIERS,
  SUPPLIER_NAME,
  CHANGES,
  CHANGE_TITLES,
  HOURLY,
  HOURS,
  HourType,
  HouryType,
  MINUTES,
  MinuteType,
  STATUS,
  DaysType,
  MemberType,
  StatusType,
} from '../../features/const';
import { Select } from '../../components/Select';
import useSWR from 'swr';
import { SaleRepository } from '../../features/sales/Repositories';
import { useEffect, useState } from 'react';
import { InputWithLabel } from '../../components/Input';
import {
  calculateChange,
  calculateSalary,
  createMembers,
  isGuestsEmpty,
  isMembersEmpty,
} from '@/utils';
import { MonthlyTbody } from '../../components/Tbody';
import { QuantityButton } from '../../components/QuantityButton';
import { Thead } from '../../components/Thead';
import { Loading } from '../../components/loading';
import Link from 'next/link';
import { MemberRepository } from '../../features/sales/Repositories';

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const month = Number(router.query.month || now.getMonth() + 1) as MonthType;
  const day = Number(router.query.day || now.getDate()) as DaysType;
  const theDay = new Date(year, month - 1, day);
  const dayOfWeek = weekItems[theDay.getDay()];
  const [loading, setLoading] = useState<boolean>(false);
  const [sale, setSale] = useState<SalesType>(SALE_INIT_VALUE);
  const paymentTotal = Object.values(sale.suppliers).reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  const [members, setMembers] = useState<
    { name: string; salary: HouryType; createdAt: Date }[]
  >([{ name: '', salary: [...HOURLY][0], createdAt: new Date() }]);

  const { data, mutate } = useSWR(
    year && month ? `/api/sales/${year}/${month}/${day}` : null,
    async () => {
      return await SaleRepository.getSales({ year, month });
    },
    {
      // revalidateOnFocus: false,
      // revalidateOnMount: false,
      // revalidateOnReconnect: false,
      // refreshWhenOffline: false,
      refreshWhenHidden: false,
      // refreshInterval: 0,
    }
  );

  const { data: staff } = useSWR(
    '/admin/members',
    async () => {
      return await MemberRepository.getMembers();
    },
    { refreshWhenHidden: false }
  );

  useEffect(() => {
    if (!staff) {
      return;
    }
    setMembers(staff);
  }, [staff]);

  useEffect(() => {
    mutate();
  }, [month]);

  useEffect(() => {
    const target = data?.find(
      (sale) => sale.year === year && sale.month === month && sale.day === day
    );
    const MEMBERS = createMembers(target, members);
    const sale = target
      ? ({
          ...target,
          year,
          month,
          day,
          dayOfWeek,
          members: MEMBERS,
        } as SalesType)
      : ({
          ...SALE_INIT_VALUE,
          year,
          month,
          day,
          dayOfWeek,
          members: MEMBERS,
        } as SalesType);

    setSale(sale);
  }, [day]);

  useEffect(() => {
    const target = data?.find(
      (sale) => sale.year === year && sale.month === month && sale.day === day
    );
    const MEMBERS = createMembers(target, members);
    const sale = target
      ? ({
          ...target,
          year,
          month,
          day,
          dayOfWeek,
          members: MEMBERS,
        } as SalesType)
      : ({
          ...SALE_INIT_VALUE,
          year,
          month,
          day,
          dayOfWeek,
          members: MEMBERS,
        } as SalesType);
    setSale(sale);
  }, [data, members]);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isGuestsEmpty(sale)) {
        return alert('来客数が未入力です');
      }
      const onDutyMembers = (sale.members as MemberType[]).filter(
        (member) => member.status === '出勤'
      );
      if (isMembersEmpty(onDutyMembers)) {
        return alert('出勤者が未入力です');
      }
      const staffSalaries = Math.ceil(
        onDutyMembers.reduce((accum, item) => accum + item.amount, 0)
      );
      const param = { ...sale, staffSalaries };
      await SaleRepository.create({ param });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      alert('🚀今日もお疲れ様でした😊');
    }
  };

  if (!staff) {
    return (
      <ProtectedRoute>
        <Loading message={'読み込み中..'} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {loading && <Loading message={'保存中..'} />}
      <div
        className={`isolate bg-white py-24 px-6 sm:py-32 lg:px-8 ${
          loading ? 'blur-sm' : ''
        }`}
      >
        <div className='mx-auto max-w-3xl content-center'>
          <h2 className='flex items-center justify-center text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {/* <Select
              options={[...YEARS]}
              htmlFor={'year'}
              textSize={'text-3xl'}
              value={year}
              onChange={(e) => {
                router.replace({
                  query: {
                    ...router.query,
                    year: e.target.value,
                  },
                });
              }}
            /> */}
            {year}&nbsp;年
            <Select
              options={[...MONTHS]}
              htmlFor={'month'}
              textSize={'text-3xl'}
              value={month}
              onChange={(e) => {
                router.replace({
                  query: {
                    ...router.query,
                    month: e.target.value,
                  },
                });
              }}
            />
            月
            <Select
              options={[...DAYS]}
              htmlFor={'day'}
              textSize={'text-3xl'}
              value={day}
              onChange={(e) => {
                router.replace({
                  query: {
                    ...router.query,
                    day: e.target.value,
                  },
                });
              }}
            />
            日（{dayOfWeek}）
            <Select
              options={[...WEATHERS]}
              htmlFor={'weather'}
              textSize={'text-3xl'}
              value={sale.weather}
              onChange={(e) => {
                setSale((sale) => ({
                  ...sale,
                  weather: e.target.value as WeatherType,
                }));
              }}
            />
          </h2>
          <h5 className='flex items-center mt-5 justify-center text-center text-xl tracking-tight sm:text-2xl text-gray-500'>
            新しいスタッフがいる場合は日報を入力の前に、
          </h5>
          <h5 className='flex items-center mt-3 justify-center text-center text-lg tracking-tight text-gray-500 sm:text-2xl'>
            <Link href='/members' legacyBehavior>
              <a className='text-2xl leading-6 text-red-500'>
                👉ここをクリック👈
              </a>
            </Link>
            してスタッフを追加してください
          </h5>
        </div>
        <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <table className='mt-16 w-full text-left shadow-md '>
            <thead className='border-y text-lg text-gray-400'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  {month}月の平均売上
                </th>
                <th scope='col' className='px-6 py-3'>
                  {month}月{day}日の平均客単価
                </th>
                <th scope='col' className='px-6 py-3'>
                  {month}月の売上累計
                </th>
              </tr>
            </thead>
            <MonthlyTbody day={day} sale={sale} sales={data ? data : [sale]} />
          </table>
        </div>
        <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
            <InputWithLabel
              name={'cash'}
              value={sale.cash}
              label={'現金'}
              labelSize={'text-lg'}
              onChange={(value) => {
                setSale((sale) => ({
                  ...sale,
                  cash: value,
                  total: sale.card + sale.eMoney + value,
                }));
              }}
            />
            <InputWithLabel
              name={'card'}
              value={sale.card}
              label={'カード'}
              labelSize={'text-lg'}
              onChange={(value) => {
                setSale((sale) => ({
                  ...sale,
                  card: value,
                  total: sale.cash + sale.eMoney + value,
                }));
              }}
            />
            <InputWithLabel
              name={'eMoney'}
              value={sale.eMoney}
              label={'電子マネー'}
              labelSize={'text-lg'}
              onChange={(value) => {
                setSale((sale) => ({
                  ...sale,
                  eMoney: value,
                  total: sale.cash + sale.card + value,
                }));
              }}
            />
            <InputWithLabel
              name={'senbero'}
              value={sale.senbero}
              label={'せんべろ'}
              labelSize={'text-lg'}
              onChange={(value) => {
                setSale((sale) => ({
                  ...sale,
                  senbero: value,
                }));
              }}
            />
            <InputWithLabel
              name={'guests'}
              value={sale.guests}
              label={'来客数'}
              labelSize={'text-lg'}
              onChange={(value) => {
                setSale((sale) => ({
                  ...sale,
                  guests: value,
                }));
              }}
              invalid={isGuestsEmpty(sale)}
            />
          </div>
          <div className='mt-5 flex justify-end text-right'>
            <div>
              <label
                htmlFor='total'
                className='block leading-6 text-gray-400 text-xl'
              >
                売上合計
              </label>
              <div className='mt-2.5 text-3xl'>
                {(sale.cash + sale.card + sale.eMoney).toLocaleString('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
            {SUPPLIERS.map((supplier) => {
              return (
                <InputWithLabel
                  key={supplier}
                  name={supplier}
                  labelSize={'text-lg'}
                  value={sale.suppliers[supplier]}
                  label={SUPPLIER_NAME[supplier]}
                  onChange={(value) => {
                    setSale((prev) => {
                      const newSales = { ...prev };
                      newSales.suppliers[supplier] = value;
                      return newSales;
                    });
                  }}
                />
              );
            })}
          </div>
          <div className='mt-5 flex justify-end text-right'>
            <div>
              <label
                htmlFor='total'
                className='block leading-6 text-gray-400 text-xl'
              >
                支払い合計
              </label>
              <div className='mt-2.5 text-3xl'>
                {paymentTotal.toLocaleString('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <table className='w-full text-center'>
            <Thead th={['', '釣り銭', '合計']} />
            <tbody>
              {CHANGES.map((change) => {
                return (
                  <tr key={change} className='border-b hover:bg-gray-50'>
                    <td className='px-6 py-4 text-lg'>
                      {CHANGE_TITLES[change]}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-center space-x-3'>
                        <QuantityButton
                          isAdd={false}
                          onClick={() => {
                            const total = sale.changes[change] - 1;
                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.changes[change] = total;
                              return newSales;
                            });
                          }}
                        />
                        <div>
                          <input
                            type='text'
                            inputMode='numeric'
                            pattern='\d*'
                            id={change}
                            className='block w-16 rounded-lg border border-gray-300 px-2.5 py-1 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                            value={sale.changes[change]}
                            onChange={(e) => {
                              setSale((prev) => {
                                const newSales = { ...prev };
                                newSales.changes[change] = Number(
                                  e.target.value
                                );
                                return newSales;
                              });
                            }}
                            required
                          />
                        </div>
                        <QuantityButton
                          isAdd={true}
                          onClick={() => {
                            const total = sale.changes[change] + 1;
                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.changes[change] = total;
                              return newSales;
                            });
                          }}
                        />
                      </div>
                    </td>
                    <td className='px-6 py-4 text-lg'>
                      {calculateChange({
                        change: sale.changes[change],
                        type: change,
                      }).toLocaleString('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className='mt-5 flex justify-end text-right'>
            <div>
              <label
                htmlFor='total'
                className='block leading-6 text-gray-400 text-xl'
              >
                釣り銭合計
              </label>
              <div className='mt-2.5 text-3xl'>
                {CHANGES.map((v) => {
                  return calculateChange({
                    change: sale.changes[v],
                    type: v,
                  });
                })
                  .reduce((partialSum, a) => partialSum + a, 0)
                  .toLocaleString('ja-JP', {
                    style: 'currency',
                    currency: 'JPY',
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className='mx-auto mt-9 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <table className='w-full text-left text-lg'>
            <Thead th={['名前', '勤怠', '勤務時間', '時給', '金額']} />
            <tbody>
              {sale.members.map((member) => {
                return (
                  <tr key={member.name} className='border-b'>
                    <td className='py-4 px-5 text-lg w-1/5'>{member.name}</td>
                    <td className='py-4'>
                      <Select
                        options={[...STATUS]}
                        htmlFor={'kintai'}
                        textSize={'text-lg'}
                        value={member.status}
                        onChange={(e) => {
                          setSale((prev) => {
                            const newSales = { ...prev };
                            newSales.members = newSales.members.map((value) =>
                              value.name === member.name
                                ? {
                                    ...value,
                                    status: e.target.value as StatusType,
                                    fromHour: [...HOURS][0],
                                    fromMin: [...MINUTES][0],
                                    toHour: [...HOURS][0],
                                    toMin: [...MINUTES][0],
                                    hourly: [...HOURLY][0],
                                    amount: 0,
                                  }
                                : value
                            );
                            return newSales;
                          });
                        }}
                      />
                    </td>
                    <td className='py-4'>
                      <div className='flex items-center'>
                        <Select
                          options={[...HOURS]}
                          htmlFor={'fromHours'}
                          textSize={'text-lg'}
                          name={'fromHours'}
                          value={member.fromHour}
                          onChange={(e) => {
                            const amount = calculateSalary({
                              fromHour: Number(e.target.value) as HourType,
                              fromMin: member.fromMin,
                              toHour: member.toMin,
                              toMin: member.toMin,
                              hourly: member.hourly,
                            });

                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.members = newSales.members.map((value) =>
                                value.name === member.name
                                  ? {
                                      ...value,
                                      fromHour: Number(
                                        e.target.value
                                      ) as HourType,
                                      amount: amount,
                                    }
                                  : value
                              );
                              return newSales;
                            });
                          }}
                          disabled={member.status === '休み'}
                        />
                        <span className='mx-1 text-xl'>:</span>
                        <Select
                          options={[...MINUTES]}
                          htmlFor={'fromMin'}
                          textSize={'text-lg'}
                          name={'fromMin'}
                          value={member.fromMin}
                          onChange={(e) => {
                            const amount = calculateSalary({
                              fromHour: member.fromHour,
                              fromMin: Number(e.target.value) as MinuteType,
                              toHour: member.toHour,
                              toMin: member.toMin,
                              hourly: member.hourly,
                            });

                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.members = newSales.members.map((value) =>
                                value.name === member.name
                                  ? {
                                      ...value,
                                      fromMin: Number(
                                        e.target.value
                                      ) as MinuteType,
                                      amount: amount,
                                    }
                                  : value
                              );
                              return newSales;
                            });
                          }}
                          disabled={member.status === '休み'}
                        />
                        <span className='mx-1 text-xl'>~</span>
                        <Select
                          options={[
                            ...HOURS.filter((hour) => {
                              return hour >= member.fromHour;
                            }),
                          ]}
                          htmlFor={'toHours'}
                          textSize={'text-lg'}
                          name={'toHours'}
                          value={member.toHour}
                          onChange={(e) => {
                            const amount = calculateSalary({
                              fromHour: member.fromHour,
                              fromMin: member.fromMin,
                              toHour: Number(e.target.value) as HourType,
                              toMin: member.toMin,
                              hourly: member.hourly,
                            });
                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.members = newSales.members.map((value) =>
                                value.name === member.name
                                  ? {
                                      ...value,
                                      toHour: Number(
                                        e.target.value
                                      ) as HourType,
                                      amount: amount,
                                    }
                                  : value
                              );
                              return newSales;
                            });
                          }}
                          disabled={member.status === '休み'}
                        />
                        <span className='mx-1 text-xl'>:</span>
                        <Select
                          options={[...MINUTES]}
                          htmlFor={'toMin'}
                          textSize={'text-lg'}
                          name={'toMin'}
                          value={member.toMin}
                          onChange={(e) => {
                            const amount = calculateSalary({
                              fromHour: member.fromHour,
                              fromMin: member.fromMin,
                              toHour: member.toHour,
                              toMin: Number(e.target.value) as MinuteType,
                              hourly: member.hourly,
                            });

                            setSale((prev) => {
                              const newSales = { ...prev };
                              newSales.members = newSales.members.map((value) =>
                                value.name === member.name
                                  ? {
                                      ...value,
                                      toMin: Number(
                                        e.target.value
                                      ) as MinuteType,
                                      amount: amount,
                                    }
                                  : value
                              );
                              return newSales;
                            });
                          }}
                          disabled={member.status === '休み'}
                        />
                      </div>
                    </td>
                    <td className='py-4'>{member.hourly}</td>
                    <td
                      className={`px-4 py-4 text-lg ${
                        member.amount < 0 ? 'text-red-700' : ''
                      }`}
                    >
                      {member.amount.toLocaleString('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className='mt-5 flex justify-end text-right'>
            <div>
              <label
                htmlFor='total'
                className='block leading-6 text-gray-400 text-xl'
              >
                お給料合計
              </label>
              <div className='mt-2.5 text-3xl'>
                {sale.members
                  .reduce((partialSum, a) => partialSum + a.amount, 0)
                  .toLocaleString('ja-JP', {
                    style: 'currency',
                    currency: 'JPY',
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className='mx-auto mt-16 max-w-3xl sm:mt-20'>
          <div className='mt-10 sm:col-span-2'>
            <label
              htmlFor='message'
              className='block text-lg  leading-6 text-gray-900'
            >
              所感
            </label>
            <div className='mt-2.5'>
              <textarea
                name='message'
                id='message'
                rows={5}
                className='block w-full rounded-md border-0 px-4 py-3 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6'
                defaultValue={sale.impression}
                onChange={(e) =>
                  setSale((sale) => ({
                    ...sale,
                    impression: e.target.value,
                  }))
                }
                placeholder='ランチタイムはサラリーマンやOLが中心で、通常通りの客入り。雨の影響はあまり感じなかった（パラパラ程度だった）傘が荷物になっているため、保管場所は要検討（スペースが足りていない）'
              />
            </div>
          </div>
          <div className='mt-10'>
            <button
              type='button'
              className='block w-full rounded-md bg-indigo-600 px-5 py-4 text-center font-noto text-xl text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={onSubmit}
            >
              保存する
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
