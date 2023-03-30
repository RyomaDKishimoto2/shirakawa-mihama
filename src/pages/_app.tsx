import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import Navbar from '../../components/Navbar';
import Navbar from 'components/Navbar';
import { AuthContextProvider } from '../../context/AuthContext';
import type { Liff } from '@line/liff';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    // to avoid `window is not defined` error
    import('@line/liff')
      .then((liff) => liff.default)
      .then((liff) => {
        console.log('LIFF init...');
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string })
          .then(() => {
            console.log('LIFF init succeeded.');
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log(error);
            console.log('LIFF init failed.');
            setLiffError(error.toString());
          });
      });
  }, []);

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <AuthContextProvider liff={liffObject}>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </AuthContextProvider>
  );
}
