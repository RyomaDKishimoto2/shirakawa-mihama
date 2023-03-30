import { readUser } from '@/lib/user';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

interface LoginType {
  email: string;
  password: string;
}
const LoginPage = () => {
  const methods = useForm<LoginType>({ mode: 'onBlur' });
  const { logIn, liffSignUp } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: LoginType) => {
    try {
      const userCredential = await logIn(data.email, data.password);
      const snap = await readUser({ uid: userCredential.user.uid });
      if (snap.exists()) {
        router.push('/dashboard');
      } else {
        alert('ユーザーが存在しません');
        router.push('/signup');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const onSignInByLine = async () => {
    try {
      const userCredential = await liffSignUp();
      const snap = await readUser({ uid: userCredential.user.uid });
      if (snap.exists()) {
        router.push('/dashboard');
      } else {
        alert('ユーザーが存在しません');
        router.push('/signup');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className='sign-up-form container mx-auto w-96 mt-12 border-2 border-gray-400'>
      <h2 className='px-12 mt-8 text-center text-2xl font-semibold text-blue-900'>
        Log In
      </h2>
      <FormProvider {...methods}>
        <form
          action=''
          className='w-80 mx-auto pb-12 px-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mt-8'>
            <div className='flex items-center justify-between'>
              <label htmlFor='' className='block mb-3 font-sans text-blue-900'>
                Email
              </label>
            </div>

            <input
              type='email'
              {...register('email', { required: 'Email is required' })}
              className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
            />
            {errors.email && (
              <p className='text-red-400'>{errors.email.message}</p>
            )}
          </div>
          <div className='mt-8'>
            <div className='flex items-center justify-between'>
              <label htmlFor='' className='block mb-3 font-sans text-blue-900'>
                Password
              </label>
            </div>

            <input
              type='password'
              {...register('password', { required: 'Password is required' })}
              className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
            />
            {errors.password && (
              <p className='text-red-400'>{errors.password.message}</p>
            )}
          </div>

          <div className='flex justify-center pt-8'>
            <button
              type='submit'
              className={`h-12 text-center w-full bg-blue-900 border-2 rounded-md hover:shadow-lg hover:bg-blue-800 text-lg transition`}
            >
              <p className='capitalize text-white font-normal'>
                管理者としてログイン
              </p>
            </button>
          </div>
          <hr className='h-px my-8 bg-gray-200 border-0 dark:bg-gray-700' />
          <div className='flex justify-center'>
            <button
              onClick={onSignInByLine}
              type='button'
              className={`h-12 text-center w-full bg-green-500 border-2 rounded-md hover:shadow-lg hover:bg-green-800 text-lg transition`}
            >
              <p className='capitalize text-white font-normal'>
                スタッフとしてログイン
              </p>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default LoginPage;
