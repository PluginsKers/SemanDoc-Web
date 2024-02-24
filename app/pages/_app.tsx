import { AppProps } from 'next/app';
import Layout from './layout';


function DashBoard({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default DashBoard;
