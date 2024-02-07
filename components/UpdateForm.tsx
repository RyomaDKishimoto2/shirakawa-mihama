import React, { useEffect, useState } from "react";
import { SaleRepository } from "../features/sales/Repositories";
import {
  MemberType,
  MonthType,
  YearType,
  WEATHERS,
  WeatherType,
} from "../features/const";
import { Select } from "./Select";
import { DatePickerForm } from "./DatePickerForm";
import { SaleLabelSection } from "./SaleLabelSection";
import { SaleFormSection } from "./SaleFormSection";
import { SuppliersFormSection, SuppliersType } from "./SuppliersFormSection";
import { ChangesFormSection, ChangesType } from "./ChangesFormSection";
import { AttendaceFormSection } from "./AttendaceFormSection";
import { Sale } from "../features/sales/Entities";
import { SubmitButton } from "./Submit";
import {
  hasNoGuests,
  hasOnDutyMembers,
  hasEmptyName,
  roundUp,
  sumSalaries,
} from "./CreateForm";
import { Loading } from "./loading";

export const UpdateForm = ({
  todaySale,
  daylySales,
}: {
  todaySale: Sale;
  daylySales: Sale[];
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<MemberType[]>(todaySale.members);
  const [sale, setSale] = useState<Sale>(todaySale);

  useEffect(() => {
    setSale(todaySale);
    setMembers(todaySale.members);
    setSuppliers(todaySale.suppliers);
    setChanges(todaySale.changes);
  }, [todaySale]);

  const [suppliers, setSuppliers] = useState<SuppliersType>(
    todaySale.suppliers
  );
  const [changes, setChanges] = useState<ChangesType>(todaySale.changes);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (hasNoGuests(sale)) {
        throw new Error("来客数が未入力です");
      }
      const onDutyMembers = members.filter((m) => m.status === "出勤");
      if (!hasOnDutyMembers(onDutyMembers)) {
        throw new Error("出勤者が未入力です");
      }
      sale.optionals?.forEach((op) => {
        if (hasEmptyName(op)) {
          throw new Error("項目名が未入力です");
        }
      });
      // 主要ロジックがシンプルに
      const staffSalaries = roundUp(sumSalaries(onDutyMembers));
      const param = {
        ...sale,
        staffSalaries,
        suppliers,
        changes,
        members,
      };
      await SaleRepository.create(param);
      alert("🚀今日もお疲れ様でした😊");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="保存中.." />;
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mx-auto max-w-3xl">
        <div className="col-span-3 md:col-span-1">
          <Select
            options={[...WEATHERS]}
            htmlFor={"weather"}
            textSize={"text-3xl"}
            value={sale.weather}
            onChange={(e) => {
              setSale((sale) => ({
                ...sale,
                weather: e.target.value as WeatherType,
              }));
            }}
            fullWidth
          />
        </div>
        <div className="col-span-3 md:col-span-2 flex justify-center">
          <DatePickerForm
            year={sale.year as YearType}
            month={sale.month as MonthType}
            day={sale.day}
            dayOfWeek={sale.dayOfWeek}
          />
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-3xl sm:mt-20 sm:rounded-lg">
        <SaleLabelSection
          currentDay={sale.day}
          todaySale={sale}
          monthlySales={daylySales}
          month={sale.month as MonthType}
        />
      </div>
      <div className="mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg">
        <SaleFormSection<Sale>
          todaySale={sale}
          setTodaySale={setSale}
          todayCash={sale.cash}
        />
      </div>

      <div className="mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg">
        <SuppliersFormSection
          sales={daylySales}
          setSale={setSale}
          optionals={sale.optionals}
          suppliers={suppliers}
          setSuppliers={setSuppliers}
        />
      </div>
      <div className="mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg">
        <ChangesFormSection changes={changes} setChanges={setChanges} />
      </div>
      <div className="mx-auto mt-16 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg">
        <AttendaceFormSection
          sales={daylySales}
          members={members}
          setMembers={setMembers}
        />
      </div>
      <div className="mx-auto mt-16 max-w-3xl sm:mt-20">
        <div className="mt-10 sm:col-span-2">
          <h5 className="text-3xl text-gray-400">所感</h5>
          <div className="mt-2.5">
            <textarea
              name="message"
              id="message"
              rows={5}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-lg text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
              value={sale.impression}
              onChange={(e) =>
                setSale((sale) => ({
                  ...sale,
                  impression: e.target.value,
                }))
              }
              placeholder="業務連絡・報告事項・改善点など記入してください"
            />
          </div>
        </div>
        <div className="w-11/12 h-16 fixed inset-x-0 mx-auto bottom-16 flex justify-center items-center">
          <SubmitButton
            title={`${sale.month}月${sale.day}日(${sale.dayOfWeek})の日報として更新する`}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
};
