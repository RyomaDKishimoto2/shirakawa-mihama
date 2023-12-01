import { FC, useMemo } from 'react';
import { Thead } from './Thead';
import { QuantityButton } from './QuantityButton';

export const CHANGES = {
  Ichiman: '1万円',
  Gosen: '5千円',
  Nisen: '2千円',
  Sen: '1千円',
  Gohyaku: '500円',
  Hyaku: '100円',
  Gojyu: '50円',
  Jyu: '10円',
  Go: '5円',
  Ichi: '1円',
} as const;
type ChangesNameKey = keyof typeof CHANGES; // keyだけの型

export type ChangesType = {
  [key in ChangesNameKey]: number;
};

const CHANGE_VALUES = {
  Ichiman: 10000,
  Gosen: 5000,
  Nisen: 2000,
  Sen: 1000,
  Gohyaku: 500,
  Hyaku: 100,
  Gojyu: 50,
  Jyu: 10,
  Go: 5,
  Ichi: 1,
} as const;

const calculateChange = ({
  key,
  changeValue,
}: {
  key: ChangesNameKey;
  changeValue: number;
}): number => {
  return CHANGE_VALUES[key] * changeValue;
};

type ChangesFormSectionProps = {
  changes: ChangesType;
  setChanges: React.Dispatch<React.SetStateAction<ChangesType>>;
};

export const ChangesFormSection: FC<ChangesFormSectionProps> = ({
  changes,
  setChanges,
}) => {
  const changesTotal = useMemo(() => {
    return Object.entries(changes)
      .map(([key, value]) => {
        return calculateChange({
          key: key as ChangesNameKey,
          changeValue: value,
        });
      })
      .reduce((partialSum, a) => partialSum + a, 0);
  }, [changes]); // 依存配列に changes を含めます

  const keyOrder = [
    'Ichiman',
    'Gosen',
    'Nisen',
    'Sen',
    'Gohyaku',
    'Hyaku',
    'Gojyu',
    'Jyu',
    'Go',
    'Ichi',
  ];

  return (
    <>
      <table className='w-full text-center'>
        <Thead th={['', '釣り銭', '合計']} />
        <tbody>
          {keyOrder.map((key) => {
            const value = changes[key as ChangesNameKey];
            return (
              <tr
                key={key}
                className='border-b hover:bg-gray-50'
              >
                <td className='px-6 py-4 text-lg whitespace-nowrap'>
                  {CHANGES[key as ChangesNameKey]}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center justify-center space-x-3'>
                    <QuantityButton
                      isAdd={false}
                      onClick={() => {
                        const total = changes[key as ChangesNameKey] - 1;
                        setChanges((prev) => ({
                          ...prev,
                          [key]: total,
                        }));
                      }}
                    />
                    <div>
                      <input
                        type='text'
                        inputMode='numeric'
                        pattern='\d*'
                        id={key}
                        className='block w-16 rounded-lg border border-gray-300 px-2.5 py-1 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        value={value}
                        onChange={(e) =>
                          setChanges((prev) => ({
                            ...prev,
                            [key]: Number(e.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <QuantityButton
                      isAdd={true}
                      onClick={() => {
                        const total = changes[key as ChangesNameKey] + 1;
                        setChanges((prev) => ({
                          ...prev,
                          [key]: total,
                        }));
                      }}
                    />
                  </div>
                </td>
                <td className='px-6 py-4 text-lg'>
                  {calculateChange({
                    key: key as ChangesNameKey,
                    changeValue: value,
                  }).toLocaleString('ja-JP', {
                    style: 'currency',
                    currency: 'JPY',
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className='mt-5 flex justify-end text-right'>
        <div>
          <label
            htmlFor='total'
            className='block leading-6 text-gray-400 text-xl'
          >
            釣り銭合計
          </label>
          <div className='mt-2.5 text-3xl flex items-center'>
            {changesTotal > 0 && changesTotal !== 60000 && (
              <span className='mr-3 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-lg font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
                差額:
                {(changesTotal - 60000).toLocaleString('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                })}
              </span>
            )}
            {changesTotal.toLocaleString('ja-JP', {
              style: 'currency',
              currency: 'JPY',
            })}
          </div>
        </div>
      </div>
    </>
  );
};
