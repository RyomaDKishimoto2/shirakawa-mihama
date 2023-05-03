import { FC } from 'react';

type Props = {
  name: string;
  value: number;
  label: string;
};

export const LabelWithSaleInfo: FC<Props> = ({ value, name, label }) => {
  return (
    <div>
      <label htmlFor={name} className='block leading-6 text-gray-400 text-xl'>
        {label}
      </label>
      <div className='mt-2.5 text-3xl'>
        {value.toLocaleString('ja-JP', {
          style: 'currency',
          currency: 'JPY',
        })}
      </div>
    </div>
  );
};

export const SaleInfoLabel: FC<{
  value: number | string;
  label: string;
  isSale?: boolean;
}> = ({ value, label, isSale = true }) => {
  return (
    <div className='border-t border-gray-200 pt-4'>
      <dt className='font-medium text-gray-900 text-xl'>{label}</dt>
      <dd className='mt-2 text-gray-500 text-3xl'>
        {isSale
          ? value.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })
          : value}
      </dd>
    </div>
  );
};
