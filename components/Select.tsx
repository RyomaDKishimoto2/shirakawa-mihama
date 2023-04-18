import { FC } from 'react';

type Props = {
  title?: string;
  options: string[] | number[];
  htmlFor: string;
  textSize?: 'text-sm' | 'text-3xl' | 'text-lg';
  name?: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const Select: FC<Props> = ({
  title,
  options,
  htmlFor,
  textSize = 'text-sm',
  name,
  value,
  onChange,
  disabled,
  fullWidth,
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
        className={`rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 ${textSize} ${
          fullWidth && 'w-full'
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
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
