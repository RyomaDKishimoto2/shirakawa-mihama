import { RoleType } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Download } from './download';

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      name: 'Top',
      link: '/',
    },
    {
      id: 2,
      name: 'ログイン',
      link: '/login',
    },
    {
      id: 3,
      name: 'サインアップ',
      link: '/signup',
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
      <header className='flex flex-wrap container mx-auto max-w-full items-center p-6 justify-between bg-white shadow-md sticky top-0 z-50'>
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
      </header>
      {children}
    </>
  );
};

export default Navbar;
