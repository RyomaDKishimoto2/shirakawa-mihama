import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  YearType,
  MonthType,
  DaysType,
  weekItems,
} from '../../../../../features/const';
import { SaleRepository } from '../../../../../features/sales/Repositories';
import { useAuth } from '../../../../../context/AuthContext';
import { CreateFormContent } from '../../../../../components/CreateForm';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { RoleType } from '@/lib/user';
import { Loading } from '../../../../../components/loading';
import { UpdateForm } from '../../../../../components/UpdateForm';
import { FakeForm } from '../../../../../components/FakeForm';
import AccessDeninedPage from '@/pages/403';
import { useState } from 'react';
import { Switch } from '../../../../../components/Switch';

const DashboardPage: NextPage = () => {
  const now = new Date();
  const { user } = useAuth();
  const router = useRouter();
  const [nomalMode, setNomalMode] = useState<boolean>(true);
  const year = Number(router.query.year || now.getFullYear()) as YearType;
  const month = Number(router.query.month || now.getMonth() + 1) as MonthType;
  const day = Number(router.query.day || now.getDate()) as DaysType;
  const theDay = new Date(year, month - 1, day);
  const dayOfWeek = weekItems[theDay.getDay()];

  const { data: sales } = useSWR(
    year && month ? `/api/sales/${year}/${month}/${day}` : null,
    () => SaleRepository.getSales({ year, month })
  );

  // 税理士、管理人、アルバイト、改ざん後、改ざん前、すでに日報が存在する場合、存在しない場合
  // 管理者 or アルバイト or 税理士
  // 管理者+改竄後, 管理者+改竄前, 税理士+改竄後
  if (!user || !sales) {
    return <Loading message='読み込み中..' />;
  }
  const sale = sales.find(
    (sale) => sale.year === year && sale.month === month && sale.day === day
  );

  const isZeirishi = user.role === RoleType.ZEIRISHI;
  const isAdmin = user.role === RoleType.ADMIN;
  const isUpdated = sales.some((d) => d.fakeCash);

  if (isZeirishi) {
    return (
      <ProtectedRoute>
        <div className='isolate bg-white py-24 px-10 sm:py-32 lg:px-8'>
          {sale && isUpdated ? (
            <FakeForm
              todaySale={sale}
              daylySales={sales}
            />
          ) : (
            <AccessDeninedPage />
          )}
        </div>
      </ProtectedRoute>
    );
  }

  if (isAdmin) {
    return (
      <ProtectedRoute>
        <div className='isolate bg-white py-24 px-10 sm:py-32 lg:px-8'>
          {isUpdated && (
            <div className='text-center'>
              <Switch
                nomalMode={nomalMode}
                setNomalMode={setNomalMode}
              />
            </div>
          )}

          {sale && isUpdated && !nomalMode ? (
            <FakeForm
              todaySale={sale}
              daylySales={sales}
            />
          ) : sale ? (
            <UpdateForm
              todaySale={sale}
              daylySales={sales}
            />
          ) : (
            <CreateFormContent
              year={year}
              month={month}
              day={day}
              dayOfWeek={dayOfWeek}
              sales={sales ?? []}
            />
          )}
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='isolate bg-white py-24 px-10 sm:py-32 lg:px-8'>
        {sale ? (
          <UpdateForm
            todaySale={sale}
            daylySales={sales}
          />
        ) : (
          <CreateFormContent
            year={year}
            month={month}
            day={day}
            dayOfWeek={dayOfWeek}
            sales={sales ?? []}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
