import { FC } from 'react';

type Props = {
  name: string;
  value: number;
  label: string;
  onChangeValue(value: number): void;
  onChangeName(name: string): void;
  labelSize?: 'text-sm' | 'text-2xl' | 'text-3xl' | 'text-lg' | 'text-xl';
  invalid?: boolean;
  InputSize?: 'text-sm' | 'text-2xl' | 'text-3xl' | 'text-lg' | 'text-xl';
};

export const InputOptional: FC<Props> = ({
  name,
  value,
  label,
  onChangeValue,
  onChangeName,
  labelSize = 'text-sm',
  InputSize = 'text-lg',
  invalid = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className={`block leading-6 text-gray-400 ${labelSize} ${
          invalid && 'text-red-700'
        }`}
      >
        (
        <input
          type='text'
          name={name}
          id={name}
          value={name}
          placeholder='項目名を入力'
          className='mx-2 w-40 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6'
          onChange={(e) => onChangeName(String(e.target.value))}
        />
        )
      </label>
      <div className='mt-2.5'>
        <input
          type='text'
          inputMode='numeric'
          pattern='\d*'
          name={String(value)}
          id={String(value)}
          className={`border border-gray-300 bg-gray-50 w-full rounded-md py-2 px-3.5 ${InputSize} leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ${
            invalid && 'border border-red-500'
          }`}
          value={value}
          onChange={(e) => onChangeValue(Number(e.target.value))}
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
