import { FC, useState } from 'react';
import { MONTHS, MonthType, YearType } from '../features/const';
import { useRouter } from 'next/router';
import * as ExcelJS from 'exceljs';
import axios from 'axios';
import { SaleRepository } from '../features/sales/Repositories';
import { isNumber } from '@/utils';

export const Download: FC = () => {
  const router = useRouter();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const thisMonth = Number(
    router.query.month || now.getMonth() + 1
  ) as MonthType;
  const [selectedMonth, setMonth] = useState<MonthType>(thisMonth);

  const onDownload = async () => {
    const res = await axios.get('/keiri.xlsx', {
      responseType: 'arraybuffer',
    });
    const data = new Uint8Array(res.data);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    const sales = await SaleRepository.getSales({
      year,
      month: selectedMonth,
    });
    if (!sales.length) {
      alert(`${selectedMonth}月の日報が存在しません`);
      return;
    }
    try {
      const worksheet = workbook.getWorksheet('copy');
      let row = worksheet.getRow(3);
      let iCount = 0;
      let total = 0;
      for (const sale of sales) {
        // dayが存在しない時対応
        total = total + isNumber(sale.total);
        row = worksheet.getRow(sale.day + 2);
        row.getCell(3).value = isNumber(sale.suppliers.yachin); // 土地代家賃
        row.getCell(4).value = isNumber(sale.suppliers.kounetuhi); // 水道光熱費
        row.getCell(5).value =
          isNumber(sale.suppliers.shopping) + isNumber(sale.suppliers.zenoki); // 食材仕入れ
        row.getCell(6).value =
          isNumber(sale.suppliers.sakihama) +
          isNumber(sale.suppliers.miyazato) +
          isNumber(sale.suppliers.ganaha) +
          isNumber(sale.suppliers.BEEFshin); // 買掛
        row.getCell(7).value =
          isNumber(sale.suppliers.furikomiFee) +
          isNumber(sale.suppliers.cardFee); // 手数料
        row.getCell(8).value = isNumber(sale.suppliers.zappi); // 雑費
        row.getCell(9).value = isNumber(sale.suppliers.tushinhi); // 通信費
        row.getCell(10).value = isNumber(sale.suppliers.kemutou); // 消耗品
        row.getCell(11).value = isNumber(sale.suppliers.eigyou); // 営業経費
        row.getCell(12).value = isNumber(sale.suppliers.gyoumu); // ボーナス
        row.getCell(13).value = isNumber(sale.staffSalaries); // 人件費
        row.getCell(15).value = isNumber(sale.cash); // 現金売上
        row.getCell(16).value = isNumber(sale.card); // カード売上
        row.getCell(17).value = isNumber(sale.eMoney); // 電子マネー
        row.getCell(21).value = isNumber(sale.senbero); // せんべろ
        row.getCell(23).value = isNumber(sale.guests); // 総来客数
        row.getCell(24).value = sale.weather; // 天気
        iCount += 1;
      }
      let averageForDay = worksheet.getRow(39);
      averageForDay.getCell(20).value = total / sales.length;
      const uint8Array = await workbook.xlsx.writeBuffer();
      const blob = new Blob([uint8Array], {
        type: 'application/octet-binary',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedMonth}月.xlsx`;
      a.click();
      a.remove();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (e: any) {
      alert(`エラーが発生しました: ${e.message}`);
    }
  };

  return (
    <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
      <div className='flex items-center justify-between max-w-2xl p-2 mx-auto border border-indigo-600 cursor-pointer rounded-xl'>
        <select
          value={selectedMonth}
          id='month'
          name='month'
          className='h-full block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:text-sm sm:leading-6 px-2'
          onChange={(v) => {
            setMonth(Number(v.target.value) as MonthType);
          }}
        >
          {MONTHS.map((month) => {
            return month <= thisMonth ? (
              <option key={month} value={month}>
                {month}月の売り上げを
              </option>
            ) : null;
          })}
        </select>

        <button
          type='button'
          onClick={onDownload}
          className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2'
        >
          download
        </button>
      </div>
    </li>
  );
};
