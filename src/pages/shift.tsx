import ProtectedRoute from "../../components/ProtectedRoute";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { MonthType, YearType, DaysType } from "../../features/const";
import useSWR from "swr";
import { SaleRepository } from "../../features/sales/Repositories";
import { useEffect, useState } from "react";
import { calcTotalSalary } from "@/utils";
import { MemberRepository } from "../../features/sales/Repositories";
import DatePicker, { registerLocale } from "react-datepicker";
import { Tab, Transition } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ShitPage: NextPage = () => {
  const router = useRouter();
  const now = new Date();
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const month = Number(router.query.month || now.getMonth() + 1) as MonthType;
  const day = Number(router.query.day || now.getDate()) as DaysType;
  const [active, setActive] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(
    new Date(`${year}/${month}/${day}`)
  );
  const [totalSalary, setTotalSalary] = useState<number>(0);
  const handleChange = (date: Date) => {
    setStartDate(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    router.replace({
      query: {
        ...router.query,
        month,
      },
    });
  };

  const { data, mutate } = useSWR(
    year && month ? `/api/sales/${year}/${month}/${day}` : null,
    async () => {
      return await SaleRepository.getSales({ year, month });
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    }
  );

  const { data: staff } = useSWR(
    "/admin/members",
    async () => {
      return await MemberRepository.getMembers();
    },
    { refreshWhenHidden: false }
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    const totalSalary = calcTotalSalary({
      name: active,
      sales: data,
    });
    setTotalSalary(totalSalary);
  }, [data]);

  useEffect(() => {
    mutate();
  }, [month]);

  useEffect(() => {
    if (!staff) {
      return;
    }
    setActive(staff[0].name);
  }, [staff]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const totalSalary = calcTotalSalary({
      name: active,
      sales: data,
    });
    setTotalSalary(totalSalary);
  }, [active]);

  return (
    <ProtectedRoute>
      <div className="isolate bg-gray-50 py-14 px-5 pb-14 sm:pb-14 lg:px-8">
        <div className="grid grid-cols-3 gap-2 mx-auto max-w-3xl">
          <div className="col-span-5 flex justify-center items-center">
            <div className="relative inline-flex items-center text-center px-3">
              <DatePicker
                locale={ja}
                className="p-2.5 border border-gray-400 rounded-md cursor-pointer text-3xl w-full"
                selected={startDate}
                onChange={handleChange}
                dateFormat="yyyy/MM"
                showMonthYearPicker
                showFullMonthYearPicker
              />
              <div className="absolute inline-flex items-center justify-center text-md font-bold bg-gray-900 text-white border-2 border-white rounded-full -bottom-5 right-5  px-3 py-1 w-fit">
                月の勤怠表
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border p-2">
        <Tab.Group vertical>
          <Tab.List className="flex flex-col w-40 p-3 space-y-1 bg-white border">
            {staff?.map((s) => {
              return (
                <Tab
                  key={s.name}
                  className={({ selected }) =>
                    (selected ? "bg-gray-900 text-white" : "text-gray-400") +
                    " p-2 rounded-md"
                  }
                  onClick={() => setActive(s.name)}
                >
                  {s.name}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels className="flex-1">
            {staff?.map((s) => {
              return (
                <Tab.Panel
                  key={s.name}
                  className="p-4 bg-white border border-l-0"
                >
                  <div
                    key={s.name}
                    id="tabs-with-underline-1"
                    role="tabpanel"
                    aria-labelledby="tabs-with-underline-item-1"
                    className={`${active === s.name ? "" : "hidden"}`}
                  >
                    <table className="table-auto w-full">
                      <thead>
                        <tr className="text-left">
                          <th className="px-4 py-2">日付</th>
                          <th className="px-4 py-2">勤怠</th>
                          <th className="px-4 py-2">開始時間</th>
                          <th className="px-4 py-2">終了時間</th>
                          <th className="px-4 py-2">時給</th>
                          <th className="px-4 py-2">日給</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data
                          ?.sort((a, b) => a.day - b.day)
                          .map((d) => {
                            return d.members.map((m) => {
                              return m.name === s.name ? (
                                <tr key={`${d.day}_${s.name}`}>
                                  <td className="border px-4 py-2">
                                    {d.day}({d.dayOfWeek})
                                  </td>
                                  <td className="border px-4 py-2">
                                    {m.status}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {m.status === "出勤"
                                      ? m.fromHour +
                                        ":" +
                                        (m.fromMin === 0 ? "00" : m.fromMin)
                                      : "---"}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {m.status === "出勤"
                                      ? m.toHour +
                                        ":" +
                                        (m.toMin === 0 ? "00" : m.toMin)
                                      : "---"}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {m.status === "出勤"
                                      ? m.hourly.toLocaleString("ja-JP", {
                                          style: "currency",
                                          currency: "JPY",
                                        })
                                      : "---"}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {m.status === "出勤"
                                      ? Math.ceil(m.amount).toLocaleString(
                                          "ja-JP",
                                          {
                                            style: "currency",
                                            currency: "JPY",
                                          }
                                        )
                                      : "---"}
                                  </td>
                                </tr>
                              ) : null;
                            });
                          })}
                      </tbody>
                    </table>
                    <div className="mt-5 flex justify-end text-right">
                      <div>
                        <label
                          htmlFor="total"
                          className="block leading-6 text-gray-400 text-xl"
                        >
                          月合計
                        </label>
                        <div className="mt-2.5 text-3xl flex items-center">
                          {totalSalary.toLocaleString("ja-JP", {
                            style: "currency",
                            currency: "JPY",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ProtectedRoute>
  );
};

export default ShitPage;
