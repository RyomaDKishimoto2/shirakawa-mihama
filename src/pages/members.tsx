import type { NextPage } from 'next';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Loading } from '../../components/loading';
import { useEffect, useState } from 'react';
import { Thead } from '../../components/Thead';
import { Select } from '../../components/Select';
import { HOURLY, HouryType } from '../../features/const';
import { Member, MemberRepository } from '../../features/sales/Repositories';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { SubmitButton } from '../../components/Submit';

const MembersPage: NextPage = () => {
  const now = new Date();
  const router = useRouter();
  const day = Number(router.query.day || now.getDate());
  const [loading, setLoading] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([
    { name: '', salary: [...HOURLY][0], createdAt: new Date() },
  ]);
  const [newMember, setNewMember] = useState<Member | null>(null);
  const { data: staff } = useSWR(
    '/admin/members',
    async () => {
      return await MemberRepository.getMembers();
    },
    { refreshWhenHidden: false }
  );

  useEffect(() => {
    if (!staff) {
      return;
    }
    setMembers(staff);
  }, [staff]);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const param =
        newMember && newMember.name
          ? [...members, newMember].map((obj) => {
              return Object.assign({}, obj);
            })
          : members.map((obj) => {
              return Object.assign({}, obj);
            });
      await MemberRepository.createMembers(param);
      alert('🚀正常に新規でスタッフ追加されました😊');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setNewMember(null);
    }
  };

  const onDelete = async (name: string) => {
    setLoading(true);
    try {
      const param = members
        .filter((mem) => mem.name !== name)
        .map((obj) => {
          return Object.assign({}, obj);
        });
      await MemberRepository.createMembers(param);
      alert('🚀正常にデータが削除されました😊');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!staff) {
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
                setNewMember({
                  name: '',
                  salary: [...HOURLY][0] as HouryType,
                  createdAt: new Date(),
                });
              }}
              className='text-gray-900 ring-1 ring-inset ring-gray-300  bg-white hover:text-white rounded-md px-4 py-3 text-lg font-medium'
            >
              スタッフを追加
            </button>
          </div>
          <table className='w-full text-left text-lg'>
            <Thead th={['名前', '時給', '']} />
            <tbody className='px-10'>
              {newMember ? (
                <tr className='border-b'>
                  <td className='py-4 px-5 text-lg w-9/12'>
                    <input
                      type='text'
                      id='new-member-name'
                      className='block w-full rounded-lg border border-gray-300 px-2.5 py-1 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={newMember.name}
                      onChange={(e) => {
                        setNewMember({
                          createdAt: newMember.createdAt,
                          salary: newMember.salary,
                          name: e.target.value,
                        });
                      }}
                      required
                    />
                  </td>
                  <td className='py-4 px-5'>
                    <Select
                      options={[...HOURLY]}
                      htmlFor={'hourly'}
                      name={'hourly'}
                      textSize={'text-lg'}
                      value={newMember.salary}
                      onChange={(e) => {
                        setNewMember({
                          createdAt: newMember.createdAt,
                          salary: Number(e.target.value) as HouryType,
                          name: newMember.name,
                        });
                      }}
                    />
                  </td>
                </tr>
              ) : null}

              {members && members.length ? (
                members.map((member, index) => {
                  return (
                    <tr key={index} className='border-b'>
                      <td className='py-4 px-5 text-lg  w-9/12'>
                        {member.name}
                      </td>
                      <td className='py-4 px-5'>
                        <Select
                          options={[...HOURLY]}
                          htmlFor={'hourly'}
                          name={'hourly'}
                          textSize={'text-lg'}
                          value={member.salary}
                          onChange={(e) => {
                            setMembers((prevState) =>
                              prevState.map((obj) =>
                                obj.name === member.name
                                  ? {
                                      createdAt: member.createdAt,
                                      name: member.name,
                                      salary: Number(
                                        e.target.value
                                      ) as HouryType,
                                    }
                                  : obj
                              )
                            );
                          }}
                        />
                      </td>

                      {day === 1 ? (
                        <td className='py-4 px-5 w-4/12'>
                          <button
                            type='button'
                            className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            onClick={async () => {
                              if (day !== 1) {
                                alert('削除は毎月1日に行ってください');
                              }
                              if (window.confirm('本当に削除しますか？')) {
                                await onDelete(member.name);
                              }
                            }}
                            disabled={day !== 1}
                          >
                            削除する
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  );
                })
              ) : (
                <tr className='border-b'>
                  <td className='py-4 px-5 text-lg w-full'></td>
                  <td className='py-4 px-5'>
                    <Select
                      options={[...HOURLY]}
                      htmlFor={'hourly'}
                      name={'hourly'}
                      textSize={'text-lg'}
                      value={[...HOURLY][0]}
                      onChange={(e) => {
                        setMembers([
                          {
                            name: '',
                            salary: [...HOURLY][0],
                            createdAt: new Date(),
                          },
                        ]);
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='text-center mt-16'>
          <SubmitButton title={'変更を保存する'} onSubmit={onSubmit} />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MembersPage;
