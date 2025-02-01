import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { PageLoader } from '@/components/page-loader/page-loader';
import Providers from '@/providers/Providers';
import { Header } from '@/components/header/header';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="relative py-10 font-roboto">
        <Header />
        <Suspense fallback={<PageLoader screen />}>
          <Outlet />
        </Suspense>
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
