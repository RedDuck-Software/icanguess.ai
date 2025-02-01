/* eslint-disable no-inline-styles/no-inline-styles */
import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { PageLoader } from '@/components/page-loader/page-loader';
import Providers from '@/providers/Providers';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div
        style={{
          backgroundImage: "url('/Noise.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
        className="relative bg-dark font-roboto"
      >
        <Header />
        <Suspense fallback={<PageLoader screen />}>
          <Outlet />
        </Suspense>
        <Footer />
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
