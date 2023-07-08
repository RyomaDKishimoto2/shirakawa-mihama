import type { NextPage } from 'next';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Loading } from '../../components/loading';
import { useEffect, useState } from 'react';
import { Thead } from '../../components/Thead';
import { Select } from '../../components/Select';
import { HOURLY, HouryType } from '../../features/const';
import {
  CreateMemberInput,
  MemberRepository,
} from '../../features/sales/Repositories';
import useSWR from 'swr';
import { useAuth } from '../../context/AuthContext';
import { createPassword, isTachikawa } from '@/utils';
import { createUser, RoleType } from '@/lib/user';
import { useRouter } from 'next/router';

const MembersPage: NextPage = () => {
  const { user, signUp } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<CreateMemberInput[]>([]);
  const [newWorker, setNewWorker] = useState<CreateMemberInput | null>(null);
  const router = useRouter();
  const { data: staff, mutate } = useSWR(
    '/admin/staffs',
    async () => {
      return await MemberRepository.getStaffs();
    },
    { refreshWhenHidden: false }
  );

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user.role === RoleType.USER && !isTachikawa(user.userId)) {
      router.push('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    if (!staff) {
      return;
    }
    setMembers(staff);
  }, [staff]);

  const add = async () => {
    if (!newWorker) {
      return;
    }
    if (!newWorker.email || !newWorker.password || !newWorker.name) {
      return alert(
        '追加するスタッフのemail, password, 名前が入力されている事を確認してください'
      );
    }
    setLoading(true);
    try {
      // STAFF_INFO & STAFF_MINIMAM_INFO & users作成処理
      await MemberRepository.addNewMember(newWorker);
      const userCredential = await signUp(newWorker.email, newWorker.password);
      await createUser({
        userId: userCredential.user.uid,
        role: RoleType.USER,
      });
      mutate();
      alert('🚀正常にメンバーが追加されました😊');
    } catch (e) {
      console.error(e);
      alert('追加処理中にエラーが発生しました');
    } finally {
      setLoading(false);
      setNewWorker(null);
    }
  };

  const onUpdate = async ({
    name,
    isDelete = false,
    salary,
  }: {
    name: string;
    isDelete: boolean;
    salary?: HouryType;
  }) => {
    setLoading(true);
    try {
      if (isDelete) {
        await MemberRepository.deleteMember(name);
        alert('🚀正常にデータが削除されました😊');
      } else {
        if (!salary) {
          return;
        }
        await MemberRepository.updateSalary(name, salary);
        alert('🚀正常に時給を更新しました😊');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!staff || !user) {
    return (
      <ProtectedRoute>
        <Loading message={'読み込み中..'} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {loading && <Loading message={'更新中..'} />}
      <div
        className={`isolate bg-white px-6 lg:px-8 pb-32 ${
          loading ? 'blur-sm' : ''
        }`}
      >
        <div className='mx-auto mt-9 max-w-3xl overflow-x-auto sm:mt-20 sm:rounded-lg'>
          <div className='py-5 text-right'>
            <button
              type='button'
              onClick={() => {
                setNewWorker({
                  name: '',
                  email: '',
                  password: '',
                  isDeleted: false,
                  salary: [...HOURLY][0] as HouryType,
                  createdAt: new Date(),
                });
              }}
              className='text-gray-900 ring-1 ring-inset ring-gray-300  bg-white rounded-md px-4 py-3 text-lg font-medium'
            >
              スタッフを追加
            </button>
          </div>
          <table className='w-full text-left text-lg table-auto'>
            <Thead th={['名前', 'email', 'password', '時給', '', '']} />
            <tbody className='px-10'>
              {newWorker ? (
                <tr className='border-b'>
                  <td className='py-4 px-2 text-lg'>
                    <input
                      type='text'
                      id='new-member-name'
                      className='block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={newWorker.name}
                      onChange={(e) => {
                        setNewWorker((prev) => ({
                          ...(prev as CreateMemberInput),
                          name: e.target.value,
                        }));
                      }}
                      required
                    />
                  </td>
                  <td className='py-4 px-2'>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      autoComplete='email'
                      value={newWorker.email}
                      onChange={(e) => {
                        setNewWorker((prev) => ({
                          ...(prev as CreateMemberInput),
                          email: e.target.value,
                        }));
                      }}
                      className='block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </td>
                  <td className='py-4 px-2'>
                    <div className='relative rounded-md shadow-sm'>
                      <input
                        type='text'
                        name='password'
                        id='password'
                        autoComplete='password'
                        value={newWorker.password}
                        className='block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      />
                      <div className='absolute inset-y-0 right-0 flex items-center'>
                        <svg
                          onClick={() => {
                            setNewWorker((prev) => ({
                              ...(prev as CreateMemberInput),
                              password: createPassword(),
                            }));
                          }}
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='h-4 rounded-md border-0 bg-transparent py-0 pl-2 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-2'>
                    <Select
                      options={[...HOURLY]}
                      htmlFor={'hourly'}
                      name={'hourly'}
                      textSize={'text-lg'}
                      value={newWorker.salary}
                      onChange={(e) => {
                        setNewWorker((prev) => ({
                          ...(prev as CreateMemberInput),
                          salary: Number(e.target.value) as HouryType,
                        }));
                      }}
                    />
                  </td>
                  <td className='py-4 px-2'>
                    <button
                      type='button'
                      className='rounded-md bg-gray-900 px-4 py-2  text-lg text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      onClick={add}
                    >
                      追加登録
                    </button>
                  </td>
                </tr>
              ) : null}

              {members.map((member) => {
                return !member.isDeleted ? (
                  <tr key={member.password} className='border-b'>
                    <td className='py-4 px-5 text-lg w-9/12 whitespace-nowrap'>
                      {member.name}
                    </td>
                    <td className='py-4 px-5'>{member.email}</td>
                    <td className='py-4 px-5'>{member.password}</td>
                    <td className='py-4 px-5'>
                      <Select
                        options={[...HOURLY]}
                        htmlFor={'hourly'}
                        name={'hourly'}
                        textSize={'text-lg'}
                        value={member.salary}
                        onChange={(e) => {
                          setMembers((prev) =>
                            prev.map((obj) =>
                              obj.name === member.name
                                ? {
                                    ...obj,
                                    salary: Number(e.target.value) as HouryType,
                                  }
                                : obj
                            )
                          );
                        }}
                      />
                    </td>
                    <td className='py-4 px-2 whitespace-nowrap'>
                      <button
                        type='button'
                        className='text-red-900 ring-1 ring-inset ring-red-300  bg-white rounded-md px-4 py-3 text-md font-medium'
                        onClick={async () => {
                          if (window.confirm('本当に削除しますか？')) {
                            await onUpdate({
                              name: member.name,
                              isDelete: true,
                            });
                          }
                        }}
                      >
                        削除する
                      </button>
                    </td>
                    <td className='py-4 whitespace-nowrap'>
                      <button
                        type='button'
                        className='text-gray-900 ring-1 ring-inset ring-gray-300  bg-white rounded-md px-4 py-3 text-md font-medium'
                        onClick={async () => {
                          await onUpdate({
                            name: member.name,
                            isDelete: false,
                            salary: member.salary,
                          });
                        }}
                      >
                        更新する
                      </button>
                    </td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MembersPage;
