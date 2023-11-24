import router from 'next/router';
import { FC, useState } from 'react';
import {
  YearType,
  MonthType,
  DaysType,
  DayOfWeekType,
} from '../features/const';
import ja from 'date-fns/locale/ja';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('ja', ja);

type Props = {
  year: YearType;
  month: MonthType;
  day: DaysType;
  dayOfWeek: DayOfWeekType;
};

export const DatePickerForm: FC<Props> = ({ year, month, day, dayOfWeek }) => {
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
        year,
        month,
        day,
      },
    });
  };

  return (
    <>
      <DatePicker
        locale={ja}
        onFocus={(e) => e.target.blur()}
        dateFormat='yyyy/MM/dd'
        selected={startDate}
        onChange={handleChange}
        className='p-2.5 border border-gray-400 rounded-md cursor-pointer text-3xl w-full'
      />
      <div className='text-3xl p-2.5'>({dayOfWeek})</div>
    </>
  );
};
