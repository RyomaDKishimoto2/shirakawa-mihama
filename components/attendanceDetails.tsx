import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Sales } from '../features/sales/Entities';
import { Thead } from './Thead';

export default function AttendanceDetails({
  sales,
  name,
}: {
  sales: Sales[] | undefined;
  name: string | null;
}) {
  const [open, setOpen] = useState(name ? true : false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setOpen(name ? true : false);
  }, [name]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <Dialog.Title
                        as='h2'
                        className='text-base font-semibold leading-6 text-gray-900'
                      >
                        <span className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-lg font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>
                          {name}
                        </span>
                      </Dialog.Title>
                      <div className='mt-2 overflow-x-auto'>
                        <table className='w-full text-left text-lg'>
                          <Thead th={['出勤日', '日給', '勤務時間', '時給']} />
                          <tbody>
                            {sales
                              ?.sort((a, b) => a.day - b.day)
                              .map((s) => {
                                const member = s.members.find(
                                  (m) => m.name === name && m.status === '出勤'
                                );
                                return member ? (
                                  <tr
                                    key={`${s.day}_${name}`}
                                    className='border-b'
                                  >
                                    <td className='p-4 px-5 text-lg w-1/5 whitespace-nowrap'>
                                      {s.month}/{s.day}日
                                    </td>
                                    <td className='p-4'>
                                      {member.amount.toLocaleString('ja-JP', {
                                        style: 'currency',
                                        currency: 'JPY',
                                      })}
                                    </td>
                                    <td className='p-4'>
                                      {member.fromHour}:
                                      {String(member.fromMin).padStart(2, '0')}~
                                      {member.toHour}:
                                      {String(member.toMin).padStart(2, '0')}
                                    </td>
                                    <td className='p-4'>
                                      {member.hourly.toLocaleString('ja-JP', {
                                        style: 'currency',
                                        currency: 'JPY',
                                      })}
                                    </td>
                                  </tr>
                                ) : null;
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    閉じる
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
