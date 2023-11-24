import React, { useEffect, useState } from 'react';
import { MemberType, MonthType, YearType, WEATHERS } from '../features/const';
import { Select } from './Select';
import { DatePickerForm } from './DatePickerForm';
import { SuppliersFormSection, SuppliersType } from './SuppliersFormSection';
import { ChangesFormSection, ChangesType } from './ChangesFormSection';
import { AttendaceFormSection } from './AttendaceFormSection';
import { LabelWithSaleInfo } from './Label';
import { Sale } from '../features/sales/Entities';
import { FakeSaleLabelSection } from './FakeSaleLabelSection';
import { FakeSaleFormSection } from './FakeSaleFormSection';

export const FakeForm = ({
  todaySale,
  daylySales,
}: {
  todaySale: Sale;
  daylySales: Sale[];
}) => {
  const [members, setMembers] = useState<MemberType[]>(todaySale.members);
  const [sale, setSale] = useState<Sale>(todaySale);

  useEffect(() => {
    setSale(todaySale);
  }, [todaySale]);

  const [suppliers, setSuppliers] = useState<SuppliersType>(
    todaySale.suppliers
  );
  const [changes, setChanges] = useState<ChangesType>(todaySale.changes);
  return (
    <>
      <div className='text-center'>
        <h1 className='text-2xl md:text-3xl font-mono tracking-tight text-red-600 mb-10'>
          日付の確認・日報の保存を忘れずに！
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
              //
            }}
            fullWidth
          />
        </div>
        <div className='col-span-3 md:col-span-2 flex justify-center'>
          <DatePickerForm
            year={sale.year as YearType}
            month={sale.month as MonthType}
            day={sale.day}
            dayOfWeek={sale.dayOfWeek}
          />
        </div>
      </div>
      <div className='mx-auto mt-16 max-w-3xl sm:mt-20 sm:rounded-lg'>
        <FakeSaleLabelSection
          currentDay={sale.day}
          todaySale={sale}
          monthlySales={daylySales}
          month={sale.month as MonthType}
        />
      </div>
      <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
        <FakeSaleFormSection
          todaySale={sale}
          todayCash={sale.cash - (sale.fakeCash || 0)}
        />
        <div className='mt-5 flex justify-end text-right'>
          <LabelWithSaleInfo
            name='total'
            value={sale.cash + sale.card + sale.eMoney - (sale.fakeCash || 0)}
            label='売上合計'
          />
        </div>
      </div>
      <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
        <SuppliersFormSection<Sale>
          sales={daylySales}
          setSale={setSale}
          optionals={sale.optionals}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
        />
      </div>
      <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
        <ChangesFormSection
          changes={changes}
          setChanges={setChanges}
        />
      </div>
      <div className='mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
        <AttendaceFormSection
          sales={daylySales}
          members={members}
          setMembers={setMembers}
        />
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
              placeholder='業務連絡・報告事項・改善点など記入してください'
              disabled
            />
          </div>
        </div>
      </div>
    </>
  );
};
