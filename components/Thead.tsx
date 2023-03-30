import { FC } from 'react';

type Props = {
  th: string[];
};

export const Thead: FC<Props> = ({ th }) => {
  return (
    <thead className='border-y text-lg text-gray-400'>
      <tr>
        {th.map((t) => {
          return (
            <th key={t} scope='col' className='px-6 py-3'>
              {t}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
