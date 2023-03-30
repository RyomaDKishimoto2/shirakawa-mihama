import { FC } from 'react';

type Props = {
  onClick(): void;
  isAdd: boolean;
};

export const QuantityButton: FC<Props> = ({ onClick, isAdd }) => {
  return (
    <button
      className='inline-flex items-center rounded-full border border-gray-300 p-1 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
      type='button'
      onClick={onClick}
    >
      <span className='sr-only'>Quantity button</span>
      <svg
        className='h-4 w-4'
        aria-hidden='true'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        {isAdd ? (
          <path
            fillRule='evenodd'
            d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
            clipRule='evenodd'
          ></path>
        ) : (
          <path
            fillRule='evenodd'
            d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          ></path>
        )}
      </svg>
    </button>
  );
};
