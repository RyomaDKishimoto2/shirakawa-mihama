import { RoleType } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Download } from './download';

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
      <div className='bg-white border-b-2'>
        <div className='mx-auto max-w-7xl p-2 sm:px-6 lg:px-8'>
          <div className='relative flex h-16 items-center justify-between'>
            <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex flex-shrink-0 items-center'>
                <img
                  className='block h-16 w-auto lg:hidden'
                  src='/static/kamon.png'
                  alt='Your Company'
                />
                <img
                  className='hidden h-16 w-auto lg:block'
                  src='/static/kamon.png'
                  alt='SHIRAKAWA SHOTEN'
                />
                {user && user.role === RoleType.ADMIN && <Download />}
              </div>
              <div className='flex space-x-4 items-center'>
                <>
                  {!user || !user.userId ? (
                    <Link href='/signup' legacyBehavior>
                      <a
                        className={classNames(
                          router.asPath === '/signup'
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-400 bg-slate-100 hover:text-white',
                          'rounded-md px-4 py-3 text-lg font-medium'
                        )}
                      >
                        サインアップ
                      </a>
                    </Link>
                  ) : (
                    <>
                      <Link href='/dashboard' legacyBehavior>
                        <a
                          className={classNames(
                            router.asPath === '/dashboard'
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-400 bg-slate-100 hover:text-white',
                            'rounded-md px-4 py-3 text-lg font-medium'
                          )}
                        >
                          日報入力
                        </a>
                      </Link>
                      <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                        <Link href='/members' legacyBehavior>
                          <a
                            className={classNames(
                              router.asPath === '/members'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-400 bg-slate-100 hover:text-white',
                              'rounded-md px-4 py-3 text-lg font-medium'
                            )}
                          >
                            スタッフ管理
                          </a>
                        </Link>
                      </li>
                    </>
                  )}
                </>
              </div>
            </div>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              {router.asPath === '/signup' && (
                <Link href='/login' legacyBehavior>
                  <a className='text-gray-300  rounded-md px-3 py-2 text-lg font-medium'>
                    ログイン <span aria-hidden='true'>&rarr;</span>
                  </a>
                </Link>
              )}
              {user && user.userId && (
                <a
                  onClick={handleLogout}
                  className='text-gray-300  rounded-md px-3 py-2 text-lg font-medium'
                >
                  ログアウト <span aria-hidden='true'>&rarr;</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <header className='flex flex-wrap container mx-auto max-w-full items-center p-6 justify-between bg-white shadow-md sticky top-0 z-50'>
        <div className='flex items-center text-blue-900 hover:text-blue-800 cursor-pointer transition duration-150 '>
          {user && user.role === RoleType.ADMIN ? <Download /> : 'SHIRAKAWA'}
        </div>

        <nav className={`md:flex md:items-center font-title w-full md:w-auto`}>
          <ul className='text-lg inline-block'>
            <>
              {!user || !user.userId ? (
                menuItems.map((item) => (
                  <li
                    key={item.id}
                    className='my-3 md:my-0 items-center mr-4 md:inline-block block '
                  >
                    <Link href={item?.link} legacyBehavior>
                      <a className='text-blue-800 hover:text-blue-900 transition'>
                        {item?.name}
                      </a>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {router.pathname !== '/dashboard' ? (
                    <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                      <Link href='/dashboard' legacyBehavior>
                        <a className='text-lg leading-6 text-gray-500'>
                          日報入力
                        </a>
                      </Link>
                    </li>
                  ) : null}
                  <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                    <Link href='/members' legacyBehavior>
                      <a className='text-lg leading-6 text-gray-500'>
                        スタッフ管理
                      </a>
                    </Link>
                  </li>
                  <li className='my-3 md:my-0 items-center mr-4 md:inline-block block '>
                    <a
                      onClick={handleLogout}
                      className='text-lg leading-6 text-gray-500'
                    >
                      ログアウト <span aria-hidden='true'>&rarr;</span>
                    </a>
                  </li>
                </>
              )}
            </>
          </ul>
        </nav>
      </header> */}
      {children}
    </>
  );
};

export default Navbar;
