import { FC } from 'react';

type Props = {
  title: string;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
};

export const SubmitButton: FC<Props> = ({ title, onSubmit }) => {
  return (
    <button
      type='button'
      className='rounded-md bg-indigo-900 px-9 py-4  text-2xl text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      onClick={onSubmit}
    >
      {title}
    </button>
  );
};
