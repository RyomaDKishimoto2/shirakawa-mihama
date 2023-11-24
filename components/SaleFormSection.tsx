import { FC } from 'react';
import { InputWithLabel } from './Input';
import { Sale, SaleData } from '../features/sales/Entities';

const isGuestsEmpty = (sales: SaleData): boolean => {
  return !!(!sales.guests && (sales.cash || sales.card || sales.eMoney));
};

type SaleFormSectionProps<T> = {
  todayCash: number;
  todaySale: SaleData;
  setTodaySale: React.Dispatch<React.SetStateAction<T>>;
};

export const SaleFormSection = <T extends Sale | SaleData>(
  props: SaleFormSectionProps<T>
) => {
  const { todayCash, todaySale, setTodaySale } = props;
  return (
    <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
      <InputWithLabel
        name='cash'
        value={todayCash}
        label='現金'
        labelSize='text-xl'
        InputSize='text-xl'
        onChange={(value) => {
          setTodaySale((sale) => ({
            ...sale,
            cash: value,
            total: sale.card + sale.eMoney + value,
          }));
        }}
      />
      <InputWithLabel
        name='card'
        value={todaySale.card}
        label='カード'
        labelSize='text-xl'
        InputSize='text-xl'
        onChange={(value) => {
          setTodaySale((sale) => ({
            ...sale,
            card: value,
            total: sale.cash + sale.eMoney + value,
          }));
        }}
      />
      <InputWithLabel
        name='eMoney'
        value={todaySale.eMoney}
        label='電子マネー'
        labelSize='text-xl'
        InputSize='text-xl'
        onChange={(value) => {
          setTodaySale((sale) => ({
            ...sale,
            eMoney: value,
            total: sale.cash + sale.card + value,
          }));
        }}
      />
      <InputWithLabel
        name={'guests'}
        value={todaySale.guests}
        label={'来客数'}
        labelSize={'text-lg'}
        onChange={(value) => {
          setTodaySale((sale) => ({
            ...sale,
            guests: value,
          }));
        }}
        invalid={isGuestsEmpty(todaySale)}
      />
    </div>
  );
};
