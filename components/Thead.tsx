import { FC } from 'react';

type Props = {
  th: string[];
};

export const Thead: FC<Props> = ({ th }) => {
  return (
    <thead className='border-y text-lg text-gray-400 whitespace-nowrap'>
      <tr>
        {th.map((t, index) => {
          return (
            <th key={index} scope='col' className='px-6 py-3 font-normal'>
              {t}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
