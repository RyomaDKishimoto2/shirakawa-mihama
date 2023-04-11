import { FC, useState } from 'react';
import { MONTHS, MonthType, YearType } from '../features/const';
import { useRouter } from 'next/router';
import * as ExcelJS from 'exceljs';
import axios from 'axios';
import { SaleRepository } from '../features/sales/Repositories';
import { isNumber } from '@/utils';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '@/lib/user';

export const Download: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const thisMonth = Number(
    router.query.month || now.getMonth() + 1
  ) as MonthType;
  const [selectedMonth, setMonth] = useState<MonthType>(thisMonth);
  const [processing, setProcessing] = useState<boolean>(false);

  const onDownload = async () => {
    if (user.role !== RoleType.ADMIN) {
      alert('管理者のみ実行可能機能！');
    }
    setProcessing(true);
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
    try {
      if (!sales.length) {
        throw new Error(`${selectedMonth}月の日報が存在しません`);
      }
      const worksheet = workbook.getWorksheet('copy');
      let row = worksheet.getRow(3);
      let nameRow = worksheet.getRow(38);
      let total = 0;
      let names = [''];
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
        // 任意日にちに出勤したアルバイト名を取得
        names = Array.from(
          new Set([...names, ...sale.members.map((mem) => mem.name)])
        );
      }
      names.map((name, index) => {
        const cellNumber = index + 2;
        nameRow.getCell(cellNumber).value = name;
      });
      for (const sale of sales) {
        // 40 D
        sale.members.map((member) => {
          nameRow.eachCell((cell, colNumber) => {
            // 名前が入力されている行を参照
            if (colNumber > 2 && colNumber < names.length + 2) {
              const row = worksheet.getRow(sale.day + 38);
              if (
                cell.value &&
                cell.value.toString() === member.name &&
                member.status === '出勤'
              ) {
                // 取得した列番に、給料を挿入
                row.getCell(colNumber).value = member.amount;
              }
            }
          });
        });
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
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className='flex items-center  max-w-xl px-2 py-1 border border-indigo-200 cursor-pointer rounded-xl sm:ml-10'>
      <select
        value={selectedMonth}
        id='month'
        name='month'
        className='h-full block rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-xs sm:leading-6 px-2'
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
      {processing ? (
        <button
          disabled
          type='button'
          className='py-2.5 px-5 mx-2 text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center'
        >
          <svg
            aria-hidden='true'
            role='status'
            className='inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='#1C64F2'
            />
          </svg>
          downloading...
        </button>
      ) : (
        <button
          type='button'
          onClick={onDownload}
          className='rounded-md bg-indigo-600  px-5 py-2 text-lg text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2'
        >
          ダウンロード
        </button>
      )}
    </div>
  );
};
