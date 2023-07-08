import ProtectedRoute from '../../components/ProtectedRoute';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  MonthType,
  weekItems,
  YearType,
  WEATHERS,
  WeatherType,
  SalesType,
  SUPPLIERS,
  SUPPLIER_NAME,
  CHANGES,
  CHANGE_TITLES,
  HOURLY,
  HOURS,
  HourType,
  MINUTES,
  MinuteType,
  STATUS,
  DaysType,
  MemberType,
  StatusType,
  DayOfWeekType,
} from '../../features/const';
import { Select } from '../../components/Select';
import useSWR from 'swr';
import { SaleRepository } from '../../features/sales/Repositories';
import { useEffect, useRef, useState } from 'react';
import { InputWithLabel } from '../../components/Input';
import { InputOptional } from '../../components/InputOptional';
import {
  calcAveDayly,
  calcAveMonthly,
  calcCheatSale,
  calcFakeAveDayly,
  calcFakeAveMonthly,
  calcFakeTotalMonthly,
  calcTotalExpenseCost,
  calcTotalMonthly,
  calcTotalMonthlyGuests,
  calcTotalMonthlyLabor,
  calcTotalSalary,
  calculateChange,
  calculateSalary,
  createMembers,
  isGuestsEmpty,
  isMembersEmpty,
  isOptionalNameEmpty,
} from '@/utils';
import { QuantityButton } from '../../components/QuantityButton';
import { Thead } from '../../components/Thead';
import { Loading } from '../../components/loading';
import { MemberRepository } from '../../features/sales/Repositories';
import { SubmitButton } from '../../components/Submit';
import { LabelWithSaleInfo, SaleInfoLabel } from '../../components/Label';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';
import { PlusIcon } from '@heroicons/react/24/outline';
import AttendanceDetails from '../../components/attendanceDetails';
import { Switch } from '../../components/Switch';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '@/lib/user';
import AccessDeninedPage from './403';
registerLocale('ja', ja);

const createSaleForm = ({
  sale,
  year,
  month,
  day,
  dayOfWeek,
  members,
}: {
  sale: SalesType | undefined;
  year: YearType;
  month: MonthType;
  day: DaysType;
  dayOfWeek: DayOfWeekType;
  members?: MemberType[];
}) => {
  return {
    year: sale?.year || year,
    month: sale?.month || month,
    day: sale?.day || day,
    cash: sale?.cash || 0,
    card: sale?.card || 0,
    eMoney: sale?.eMoney || 0,
    guests: sale?.guests || 0,
    senbero: sale?.senbero || 0,
    changes: sale?.changes || {
      Ichiman: 0,
      Gosen: 0,
      Nisen: 0,
      Sen: 0,
      Gohyaku: 0,
      Hyaku: 0,
      Gojyu: 0,
      Jyu: 0,
      Go: 0,
      Ichi: 0,
    },
    members: members ? members : sale ? sale.members : [],
    dayOfWeek: sale?.dayOfWeek || dayOfWeek,
    suppliers: sale?.suppliers || {
      suehiro: 0,
      sakihama: 0,
      miyazato: 0,
      ganaha: 0,
      BEEFshin: 0,
      zenoki: 0,
      sunny: 0,
      shopping: 0,
      zappi: 0,
      kemutou: 0,
      gyoumu: 0,
      furikomiFee: 0,
      cardFee: 0,
      eigyou: 0,
      koutuhi: 0,
      yachin: 0,
      kounetuhi: 0,
      tushinhi: 0,
      miyagi: 0,
    },
    weather: sale?.weather || '晴れ',
    total: sale?.total || 0,
    impression: sale?.impression || '',
    staffSalaries: sale?.staffSalaries || '',
    optionals: sale?.optionals || [],
    fakeCash: sale?.fakeCash,
  };
};

const DashboardPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const month = Number(router.query.month || now.getMonth() + 1) as MonthType;
  const day = Number(router.query.day || now.getDate()) as DaysType;
  const theDay = new Date(year, month - 1, day);
  const dayOfWeek = weekItems[theDay.getDay()];
  const [showAttendanceDetails, setShowAttendanceDetails] =
    useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date(`${year}/${month}/${day}`)
  );
  const handleChange = (date: Date) => {
    setStartDate(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    router.replace({
      query: {
        ...router.query,
        month,
        day,
      },
    });
  };

  const { data, mutate } = useSWR(
    year && month ? `/api/sales/${year}/${month}/${day}` : null,
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

  const { data: staff } = useSWR(
    '/admin/members',
    async () => {
      return await MemberRepository.getMembers();
    },
    { refreshWhenHidden: false }
  );

  const todaySale: SalesType | undefined = data?.find(
    (sale) => sale.year === year && sale.month === month && sale.day === day
  );

  const [sale, setSale] = useState<SalesType>(
    createSaleForm({
      year,
      month,
      day,
      sale: todaySale,
      dayOfWeek,
    }) as SalesType
  );

  useEffect(() => {
    if (!staff) {
      return;
    }
    const members = createMembers({ sale: todaySale, initMembers: staff });
    setSale(
      createSaleForm({
        year,
        month,
        day,
        sale: todaySale,
        members,
        dayOfWeek,
      }) as SalesType
    );
  }, [todaySale]);

  useEffect(() => {
    if (!staff) {
      return;
    }
    const members = createMembers({
      sale: todaySale ? todaySale : sale,
      initMembers: staff,
    });
    setSale(
      (prev) =>
        ({
          ...prev,
          members,
        } as SalesType)
    );
    setStartDate(new Date(`${year}/${month}/${day}`));
  }, [staff]);

  useEffect(() => {
    setSale(
      createSaleForm({
        year,
        month,
        day,
        sale: todaySale,
        dayOfWeek,
      }) as SalesType
    );
  }, []);

  const laborTotal = sale.members.reduce(
    (partialSum, a) => partialSum + a.amount,
    0
  );

  const paymentTotal = [
    ...sale.optionals.map((op) => op.value),
    ...Object.values(sale.suppliers),
  ].reduce((partialSum, a) => partialSum + a, 0);

  const changesTotal = CHANGES.map((v) => {
    return calculateChange({
      change: sale.changes[v],
      type: v,
    });
  }).reduce((partialSum, a) => partialSum + a, 0);

  useEffect(() => {
    mutate();
  }, [month]);

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isGuestsEmpty(sale)) {
        throw new Error('来客数が未入力です');
      }
      const onDutyMembers = (sale.members as MemberType[]).filter(
        (member) => member.status === '出勤'
      );
      if (isMembersEmpty(onDutyMembers)) {
        throw new Error('出勤者が未入力です');
      }
      sale.optionals?.map((op) => {
        if (isOptionalNameEmpty(op)) {
          throw new Error('項目名が未入力です');
        }
      });
      const staffSalaries = Math.ceil(
        onDutyMembers.reduce((accum, item) => accum + item.amount, 0)
      );
      const param = { ...sale, staffSalaries };
      await SaleRepository.create({ param });
      alert('🚀今日もお疲れ様でした😊');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };
  const [nomalMode, setNomalMode] = useState<boolean>(true);
  if (!staff || !user) {
    return (
      <ProtectedRoute>
        <Loading message={'読み込み中..'} />
      </ProtectedRoute>
    );
  }
  const isZEIRISHI = user.role === RoleType.ZEIRISHI;
  const isADMIN = user.role === RoleType.ADMIN;
  const isUpdated = data?.some((d) => d.fakeCash);
  const showFake =
    (isZEIRISHI && isUpdated) || (!nomalMode && isUpdated) ? true : false;

  return (
    <ProtectedRoute>
      {loading && <Loading message={'保存中..'} />}
      <div
        className={`isolate bg-white py-24 px-10 sm:py-32 lg:px-8 ${
          loading ? 'blur-sm' : ''
        }`}
      >
        <div className='text-center'>
          <h1 className='text-5xl font-bold tracking-tight text-gray-900 mb-8'>
            入力前に日付のチェックを忘れずに
          </h1>
        </div>
        <div className='grid grid-cols-3 gap-2 mx-auto max-w-3xl'>
          <div className='col-span-3 md:col-span-1'>
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
              fullWidth
            />
          </div>
          <div className='col-span-3 md:col-span-2 flex justify-center'>
            <DatePicker
              locale={ja}
              dateFormat='yyyy/MM/dd'
              selected={startDate}
              onChange={handleChange}
              className='p-2.5 border border-gray-400 rounded-md cursor-pointer text-3xl w-full'
            />
            <div className='text-3xl p-2.5'>({dayOfWeek})</div>
          </div>
        </div>
        {isZEIRISHI && !isUpdated ? (
          <AccessDeninedPage />
        ) : (
          <>
            <div className='mx-auto mt-16 max-w-3xl sm:mt-20 sm:rounded-lg'>
              {isUpdated && isADMIN && (
                <Switch nomalMode={nomalMode} setNomalMode={setNomalMode} />
              )}
              <dl className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-y-16 lg:gap-x-8'>
                <SaleInfoLabel
                  value={
                    showFake
                      ? calcFakeAveMonthly({
                          day,
                          sale,
                          sales: data ? data : [sale],
                        })
                      : calcAveMonthly({
                          day,
                          sale,
                          sales: data ? data : [sale],
                        })
                  }
                  label={`${month}月平均売上`}
                />
                <SaleInfoLabel
                  value={
                    showFake
                      ? calcFakeAveDayly({ sale })
                      : calcAveDayly({ sale })
                  }
                  label={`${month}/${day}平均客単価`}
                />
                <SaleInfoLabel
                  value={
                    showFake
                      ? calcFakeTotalMonthly({
                          day,
                          sale,
                          sales: data ? data : [sale],
                        })
                      : calcTotalMonthly({
                          day,
                          sale,
                          sales: data ? data : [sale],
                        })
                  }
                  label={`${month}月売上累計`}
                />
                <SaleInfoLabel
                  value={`${calcTotalMonthlyGuests({
                    sale,
                    sales: data ? data : [sale],
                  })}人`}
                  label={`${month}月来客数累計`}
                />
                <SaleInfoLabel
                  value={calcTotalMonthlyLabor({
                    day,
                    todayLabor: laborTotal,
                    sales: data ? data : [sale],
                  })}
                  label={`${month}月人件費累計`}
                  isSale={true}
                />
              </dl>
            </div>
            <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
              <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
                <InputWithLabel
                  name={'cash'}
                  value={showFake ? calcCheatSale({ sale }) : sale.cash}
                  label={'現金'}
                  labelSize='text-xl'
                  InputSize='text-xl'
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
                  labelSize='text-xl'
                  InputSize='text-xl'
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
                  labelSize='text-xl'
                  InputSize='text-xl'
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
                <LabelWithSaleInfo
                  name='total'
                  value={
                    showFake
                      ? calcCheatSale({ sale }) + sale.card + sale.eMoney
                      : sale.cash + sale.card + sale.eMoney
                  }
                  label='売上合計'
                />
              </div>
            </div>
            <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
              <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
                {SUPPLIERS.map((supplier) => {
                  const totalCost = calcTotalExpenseCost({
                    supplierName: supplier,
                    sales: data ? data : [sale],
                  });

                  return (
                    <InputWithLabel
                      key={supplier}
                      name={supplier}
                      labelSize='text-xl'
                      InputSize='text-xl'
                      value={sale.suppliers[supplier]}
                      label={SUPPLIER_NAME[supplier]}
                      onChange={(value) => {
                        setSale((prev) => {
                          const newSales = { ...prev };
                          newSales.suppliers[supplier] = value;
                          return newSales;
                        });
                      }}
                      totalCost={totalCost}
                    />
                  );
                })}
                {sale.optionals &&
                  sale.optionals.length > 0 &&
                  sale.optionals.map((optional, i) => {
                    return (
                      <InputOptional
                        key={i}
                        name={optional.name}
                        value={optional.value}
                        labelSize='text-xl'
                        InputSize='text-xl'
                        label='項目名'
                        onChangeName={(name) => {
                          setSale((prev) => ({
                            ...prev,
                            optionals: [
                              ...(prev.optionals
                                ? prev.optionals.map((op, j) =>
                                    i === j ? { ...op, name: name } : op
                                  )
                                : []),
                            ],
                          }));
                        }}
                        onChangeValue={(v) => {
                          setSale((prev) => ({
                            ...prev,
                            optionals: [
                              ...(prev.optionals
                                ? prev.optionals.map((op, j) =>
                                    i === j ? { ...op, value: v } : op
                                  )
                                : []),
                            ],
                          }));
                        }}
                        invalid={isOptionalNameEmpty(optional)}
                      />
                    );
                  })}

                <span className='flex items-end'>
                  <button
                    type='button'
                    className='w-full rounded-md bg-indigo-900 px-3 py-2 text-sm text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    onClick={() => {
                      setSale((prev) => ({
                        ...prev,
                        optionals: [
                          ...(prev.optionals ? prev.optionals : []),
                          { name: '', value: 0 },
                        ],
                      }));
                    }}
                  >
                    <PlusIcon
                      className='-ml-0.5 mr-1.5 h-5 w-5 text-gray-400 inline'
                      aria-hidden='true'
                    />
                    項目を追加する
                  </button>
                </span>
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
                        <td className='px-6 py-4 text-lg whitespace-nowrap'>
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
                  <div className='mt-2.5 text-3xl flex items-center'>
                    {changesTotal > 0 && changesTotal !== 60000 && (
                      <span className='mr-3 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-lg font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
                        差額:
                        {(changesTotal - 60000).toLocaleString('ja-JP', {
                          style: 'currency',
                          currency: 'JPY',
                        })}
                      </span>
                    )}
                    {changesTotal.toLocaleString('ja-JP', {
                      style: 'currency',
                      currency: 'JPY',
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className='mx-auto mt-9 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
              <table className='w-full text-left text-lg'>
                <Thead th={['', '名前', '勤怠', '勤務時間', '時給', '金額']} />
                <tbody>
                  {sale.members.map((member) => {
                    const totalSalary = calcTotalSalary({
                      name: member.name,
                      sales: data ? data : [sale],
                    });
                    return (
                      <tr key={member.name} className='border-b'>
                        <td className='py-4 px-5 text-lg w-1/5 whitespace-nowrap'>
                          <button
                            type='button'
                            className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                            onClick={() =>
                              setShowAttendanceDetails(member.name)
                            }
                          >
                            詳細を確認
                          </button>
                        </td>
                        <td className='py-4 px-5 text-lg w-1/5 whitespace-nowrap'>
                          <div className='min-w-0 flex-auto gap-x-4'>
                            <p className='font-semibold leading-6 text-gray-900'>
                              {member.name}
                            </p>
                            <div className='mt-2 flex items-center text-sm text-gray-500'>
                              <span className='inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-md font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
                                {totalSalary.toLocaleString('ja-JP', {
                                  style: 'currency',
                                  currency: 'JPY',
                                })}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='py-4'>
                          <Select
                            options={Object.values(STATUS).map((st) => st)}
                            htmlFor={'kintai'}
                            textSize={'text-lg'}
                            value={member.status}
                            onChange={(e) => {
                              setSale((prev) => {
                                const newSales = { ...prev };
                                newSales.members = newSales.members.map(
                                  (value) =>
                                    value.name === member.name
                                      ? {
                                          ...value,
                                          status: e.target.value as StatusType,
                                          fromHour:
                                            e.target.value === STATUS.working
                                              ? value.fromHour
                                              : [...HOURS][0],
                                          fromMin:
                                            e.target.value === STATUS.working
                                              ? value.fromMin
                                              : [...MINUTES][0],
                                          toHour:
                                            e.target.value === STATUS.working
                                              ? value.toHour
                                              : [...HOURS][0],
                                          toMin:
                                            e.target.value === STATUS.working
                                              ? value.toMin
                                              : [...MINUTES][0],
                                          hourly:
                                            e.target.value === STATUS.working
                                              ? value.hourly
                                              : [...HOURLY][0],
                                          amount:
                                            e.target.value === STATUS.working
                                              ? value.amount
                                              : 0,
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
                                  toHour: member.toHour,
                                  toMin: member.toMin,
                                  hourly: member.hourly,
                                });

                                setSale((prev) => {
                                  const newSales = { ...prev };
                                  newSales.members = newSales.members.map(
                                    (value) =>
                                      value.name === member.name
                                        ? {
                                            ...value,
                                            fromHour: Number(
                                              e.target.value
                                            ) as HourType,
                                            amount: amount <= 0 ? 0 : amount,
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
                                  newSales.members = newSales.members.map(
                                    (value) =>
                                      value.name === member.name
                                        ? {
                                            ...value,
                                            fromMin: Number(
                                              e.target.value
                                            ) as MinuteType,
                                            amount: amount <= 0 ? 0 : amount,
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
                                  newSales.members = newSales.members.map(
                                    (value) =>
                                      value.name === member.name
                                        ? {
                                            ...value,
                                            toHour: Number(
                                              e.target.value
                                            ) as HourType,
                                            amount: amount <= 0 ? 0 : amount,
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
                                  newSales.members = newSales.members.map(
                                    (value) =>
                                      value.name === member.name
                                        ? {
                                            ...value,
                                            toMin: Number(
                                              e.target.value
                                            ) as MinuteType,
                                            amount: amount <= 0 ? 0 : amount,
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
                        <td className='p-4'>{member.hourly}</td>
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
              <AttendanceDetails sales={data} name={showAttendanceDetails} />
              <div className='mt-5 flex justify-end text-right'>
                <div>
                  <label
                    htmlFor='total'
                    className='block leading-6 text-gray-400 text-xl'
                  >
                    お給料合計
                  </label>
                  <div className='mt-2.5 text-3xl flex items-center'>
                    <span className='mr-3 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-lg font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                      出勤者数
                      {
                        sale.members.filter((mem) => mem.status === '出勤')
                          .length
                      }
                      人
                    </span>
                    {laborTotal.toLocaleString('ja-JP', {
                      style: 'currency',
                      currency: 'JPY',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className='mx-auto mt-16 max-w-3xl sm:mt-20'>
              <div className='mt-10 sm:col-span-2'>
                <h5 className='text-3xl text-gray-400'>所感</h5>
                <div className='mt-2.5'>
                  <textarea
                    name='message'
                    id='message'
                    rows={5}
                    className='block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6'
                    value={sale.impression}
                    onChange={(e) =>
                      setSale((sale) => ({
                        ...sale,
                        impression: e.target.value,
                      }))
                    }
                    placeholder='業務連絡・報告事項・改善点など記入してください'
                  />
                </div>
              </div>
              {!showFake && (
                <div className='text-center mt-16'>
                  <SubmitButton title={'保存する'} onSubmit={onSubmit} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
