import { useCallback, useMemo } from 'react';
import { InputWithLabel } from './Input';
import { InputOptional } from './InputOptional';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Sale, SaleData } from '../features/sales/Entities';

const SUPPLIERS = {
  suehiro: '末広商店',
  sakihama: '崎浜商店',
  miyazato: '宮里洋酒店',
  ganaha: 'ガナハミート',
  BEEFshin: 'BEEFshin',
  zenoki: 'ゼンオキ食品',
  sunny: 'サニークリン',
  shopping: '買い物',
  zappi: '雑費',
  kemutou: 'けむとうなか',
  gyoumu: '業務委託費',
  furikomiFee: '振込手数料',
  cardFee: 'カード手数料',
  eigyou: '営業経費',
  koutuhi: '旅費・交通費',
  yachin: '家賃',
  kounetuhi: '水道光熱費',
  tushinhi: '通信費',
  miyagi: '宮城熊さん',
} as const;
type SupplierNameKey = keyof typeof SUPPLIERS; // keyだけの型

export type SuppliersType = {
  [key in SupplierNameKey]: number;
};

// 各業者の合計コスト金額を計算する
const calcTotalExpenseCost = ({
  supplierName,
  sales,
}: {
  supplierName: SupplierNameKey;
  sales: Sale[];
}) => {
  const dailyCost = sales.map((s) => s.suppliers[supplierName] ?? 0);
  return dailyCost.reduce((accum, sale) => accum + sale, 0);
};

const isOptionalNameEmpty = (optional: {
  name: string;
  value: number;
}): boolean => {
  return !!(optional.value && !optional.name);
};

type SuppliersFormSectionProps<T> = {
  sales: Sale[];
  setSale: React.Dispatch<React.SetStateAction<T>>;
  optionals: { name: string; value: number }[];
  suppliers: SuppliersType;
  setSuppliers: React.Dispatch<React.SetStateAction<SuppliersType>>;
};

export const SuppliersFormSection = <T extends Sale | SaleData>(
  props: SuppliersFormSectionProps<T>
) => {
  const { sales, setSale, optionals, suppliers, setSuppliers } = props;
  const totalCosts = useMemo(
    () =>
      Object.keys(suppliers).reduce((acc, key) => {
        const supplierKey = key as SupplierNameKey;
        acc[supplierKey] = calcTotalExpenseCost({
          supplierName: supplierKey,
          sales: sales,
        });
        return acc;
      }, {} as SuppliersType),
    [sales, suppliers]
  );

  const handleSupplierChange = useCallback(
    (key: SupplierNameKey, newValue: number) => {
      setSuppliers((prevSuppliers) => ({
        ...prevSuppliers,
        [key]: newValue,
      }));
    },
    [setSuppliers]
  );

  const handleOptionalNameChange = useCallback(
    (name: string, i: number) => {
      setSale((prev) => ({
        ...prev,
        optionals: [
          ...(prev.optionals
            ? prev.optionals.map((op, j) =>
                i === j ? { ...op, name: name } : op
              )
            : []),
        ],
      }));
    },
    [setSale]
  );

  const handleOptionalValueChange = useCallback(
    (v: number, i: number) => {
      setSale((prev) => ({
        ...prev,
        optionals: [
          ...(prev.optionals
            ? prev.optionals.map((op, j) =>
                i === j ? { ...op, value: v } : op
              )
            : []),
        ],
      }));
    },
    [setSale]
  );

  const handleAddOptional = useCallback(() => {
    setSale((prev) => ({
      ...prev,
      optionals: [
        ...(prev.optionals ? prev.optionals : []),
        { name: '', value: 0 },
      ],
    }));
  }, [setSale]);

  const paymentTotal = useMemo(() => {
    const optionalsTotal = optionals.reduce((sum, op) => sum + op.value, 0);
    const suppliersTotal = Object.values(suppliers).reduce(
      (sum, value) => sum + value,
      0
    );

    return optionalsTotal + suppliersTotal;
  }, [optionals, suppliers]);

  return (
    <>
      <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3'>
        {Object.entries(suppliers)
          .sort((a, b) => (a[0] > b[0] ? 1 : -1))
          .map(([key, value]) => {
            return (
              <InputWithLabel
                key={key}
                name={key}
                labelSize='text-xl'
                InputSize='text-xl'
                value={value}
                label={SUPPLIERS[key as SupplierNameKey]}
                onChange={(newValue: number) =>
                  handleSupplierChange(key as SupplierNameKey, newValue)
                }
                totalCost={totalCosts[key as SupplierNameKey]}
              />
            );
          })}
        {optionals.length > 0 &&
          optionals.map((optional, i) => {
            return (
              <InputOptional
                key={i}
                name={optional.name}
                value={optional.value}
                labelSize='text-xl'
                InputSize='text-xl'
                label='項目名'
                onChangeName={(name: string) =>
                  handleOptionalNameChange(name, i)
                }
                onChangeValue={(v: number) => handleOptionalValueChange(v, i)}
                invalid={isOptionalNameEmpty(optional)}
              />
            );
          })}
        <span className='flex items-end'>
          <button
            type='button'
            className='w-full rounded-md bg-gray-900 px-3 py-2 text-lg text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            onClick={handleAddOptional}
          >
            <PlusIcon
              className='-ml-0.5 mr-1.5 h-7 w-7 text-gray-400 inline'
              aria-hidden='true'
            />
            項目を追加する
          </button>
        </span>
      </div>
      <div className='mt-5 flex justify-end text-right'>
        <label
          htmlFor='total'
          className='block leading-6 text-gray-400 text-xl'
        >
          支払い合計
        </label>
        <div className='mt-2.5 text-3xl'>
          {paymentTotal.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
          })}
        </div>
      </div>
    </>
  );
};
