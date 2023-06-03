import { FC } from 'react';

type Props = {
  name: string;
  value: number;
  label: string;
  onChange(value: number): void;
  labelSize?: 'text-sm' | 'text-2xl' | 'text-3xl' | 'text-lg' | 'text-xl';
  disabled?: boolean;
  invalid?: boolean;
  InputSize?: 'text-sm' | 'text-2xl' | 'text-3xl' | 'text-lg' | 'text-xl';
  totalCost?: number;
};

export const InputWithLabel: FC<Props> = ({
  name,
  value,
  label,
  onChange,
  labelSize = 'text-sm',
  InputSize = 'text-lg',
  disabled = false,
  invalid = false,
  totalCost,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className={`block leading-6 text-gray-400 ${labelSize} ${
          invalid && 'text-red-700'
        }`}
      >
        {label}
      </label>
      {totalCost && (
        <div className='mt-2 flex items-center text-sm text-gray-500'>
          <span className='inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-md font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'>
            {totalCost.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </span>
        </div>
      )}
      <div className='mt-2.5'>
        <input
          type='text'
          inputMode='numeric'
          pattern='\d*'
          name={name}
          id={name}
          className={`border border-gray-300 bg-gray-50 w-full rounded-md py-2 px-3.5 ${InputSize} leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ${
            invalid && 'border border-red-500'
          }`}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value));
          }}
          disabled={disabled}
        />
        {invalid && (
          <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
            <span className='font-medium'>{label}が未入力です</span>
          </p>
        )}
      </div>
    </div>
  );
};
