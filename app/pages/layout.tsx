import { Analytics } from '@vercel/analytics/react';
import Nav from '../components/nav';
import Toast from '../components/toast';
import { Suspense } from 'react';

import '../styles/globals.css';

export const metadata = {
  title: '知识库管理系统',
  description:
    '用于检索服务的知识库内容管理'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="h-full bg-gray-100">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        {children}
        <Analytics />
        <Toast />
      </body>
    </html>
  );
}
