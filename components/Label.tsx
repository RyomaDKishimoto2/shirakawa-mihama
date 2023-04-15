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
