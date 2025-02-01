import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { PageLoader } from '@/components/page-loader/page-loader';
import Providers from '@/providers/Providers';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="font-quicksand relative">
        <Suspense fallback={<PageLoader screen />}>
          <Outlet />
        </Suspense>
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
