import { FC } from 'react';

type Props = {
  title: string;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
};

export const SubmitButton: FC<Props> = ({ title, onSubmit }) => {
  return (
    <button
      type='button'
      className='w-full rounded-md bg-gray-900 px-9 py-4  text-2xl text-white '
      onClick={onSubmit}
    >
      {title}
    </button>
  );
};
