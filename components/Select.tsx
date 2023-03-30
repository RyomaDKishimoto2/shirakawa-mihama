import { FC } from 'react';

type Props = {
  title?: string;
  options: string[] | number[];
  htmlFor: string;
  textSize?: 'text-sm' | 'text-3xl' | 'text-lg';
  name?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export const Select: FC<Props> = ({
  title,
  options,
  htmlFor,
  textSize = 'text-sm',
  name,
  value,
  onChange,
}) => {
  return (
    <>
      {title && (
        <label
          htmlFor={htmlFor}
          className='mb-2 block text-sm font-medium text-gray-900'
        >
          {title}
        </label>
      )}
      <select
        id={htmlFor}
        name={name}
        className={`block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 ${textSize}`}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 0 ? '00' : option}
          </option>
        ))}
      </select>
    </>
  );
};