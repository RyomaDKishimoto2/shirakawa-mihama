import { RoleType } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { isTachikawa } from '@/utils';
import { DaysType, MonthType, YearType } from '../features/const';

const now = new Date();
const year = now.getFullYear() as YearType;
const month = (now.getMonth() + 1) as MonthType;
const day = now.getDate() as DaysType;

const navigation = [
  { name: '日報作成', href: `/${year}/${month}/${day}`, current: true },
  { name: '勤怠チェック', href: '/sfhits', current: false },
];
const navigationForAdmin = [
  { name: 'スタッフ管理', href: '/members' },
  { name: '調整', href: '/adjustment' },
];

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      {user ? (
        <Disclosure
          as='nav'
          className='bg-white border-b-2'
        >
          {({ open }) => (
            <>
              <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
                <div className='relative flex h-16 items-center justify-between'>
                  <div className='absolute inset-y-0 left-0 flex items-center lg:hidden'>
                    {/* Mobile menu button*/}
                    <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                      <span className='sr-only'>Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className='block h-6 w-6 mr-5'
                          aria-hidden='true'
                        />
                      ) : (
                        <Bars3Icon
                          className='block h-6 w-6'
                          aria-hidden='true'
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className='flex flex-1 items-center justify-center sm:justify-start'>
                    {/* <div className='flex-shrink-0 items-center hidden md:block'>
                      {user && user.role === RoleType.ADMIN && <Download />}
                    </div> */}
                    {user && user.userId && user.role === RoleType.USER && (
                      <div className='hidden lg:block'>
                        <div className='flex space-x-2'>
                          {navigation.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              legacyBehavior
                            >
                              <a
                                className={classNames(
                                  router.asPath.includes(item.href)
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-400 bg-slate-100 hover:text-white',
                                  'rounded-md px-4 py-3 text-lg font-medium'
                                )}
                              >
                                {item.name}
                              </a>
                            </Link>
                          ))}
                          {user &&
                            user.role === RoleType.ADMIN &&
                            navigationForAdmin.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                legacyBehavior
                              >
                                <a
                                  className={classNames(
                                    router.asPath.includes(item.href)
                                      ? 'bg-gray-900 text-white'
                                      : 'text-gray-400 bg-slate-100 hover:text-white',
                                    'rounded-md px-4 py-3 text-lg font-medium'
                                  )}
                                  aria-current={
                                    router.asPath.includes(item.href)
                                      ? 'page'
                                      : undefined
                                  }
                                >
                                  {item.name}
                                </a>
                              </Link>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                    {/* Profile dropdown */}
                    <Menu
                      as='div'
                      className='relative ml-3 hidden md:block'
                    >
                      <div>
                        <Menu.Button className='flex rounded-fulltext-sm '>
                          <span className='sr-only'>Open user menu</span>
                          <img
                            className='h-16 w-auto rounded-full'
                            src='/static/kamon.png'
                            alt='Your Company'
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          <Menu.Item>
                            {({ active }) =>
                              user && user.userId ? (
                                <a
                                  onClick={handleLogout}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  ログアウト
                                </a>
                              ) : (
                                <Link
                                  href='/login'
                                  legacyBehavior
                                >
                                  <a
                                    className={classNames(
                                      router.asPath === '/login'
                                        ? 'bg-gray-100'
                                        : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    ログイン
                                  </a>
                                </Link>
                              )
                            }
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className='lg:hidden'>
                <div className='space-y-1 px-2 pb-3 pt-2'>
                  {navigation.map((item, index) => (
                    <Disclosure.Button
                      key={index}
                      as='a'
                      href={item.href}
                      className={classNames(
                        router.asPath.includes(item.href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:bg-gray-300 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  {user &&
                    user.role === RoleType.ADMIN &&
                    navigationForAdmin.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as='a'
                        href={item.href}
                        className={classNames(
                          router.asPath.includes(item.href)
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-500 hover:bg-gray-300 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={
                          router.asPath.includes('/members')
                            ? 'page'
                            : undefined
                        }
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  {/* 立川さんがスタッフの給料を変更できるよう修正 */}
                  {user && isTachikawa(user.userId) && (
                    <Disclosure.Button
                      as='a'
                      href='/members'
                      className={classNames(
                        router.asPath.includes('/members')
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-500 hover:bg-gray-300 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={
                        router.asPath.includes('/members') ? 'page' : undefined
                      }
                    >
                      スタッフ管理
                    </Disclosure.Button>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ) : null}

      {children}
    </>
  );
};

export default Navbar;
