/* eslint-disable no-inline-styles/no-inline-styles */
import { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

import { PageLoader } from '@/components/page-loader/page-loader';
import { Toaster } from '@/components/ui/sonner';
import Providers from '@/providers/Providers';

const DefaultLayout = memo(() => {
  return (
    <Providers>
      <div className="relative bg-white font-roboto">
        <Suspense fallback={<PageLoader screen />}>
          <div
            style={{
              backgroundImage: "url('/Noise.png')",
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
          >
            <Outlet />
          </div>
          <Toaster />
        </Suspense>
      </div>
    </Providers>
  );
});
DefaultLayout.displayName = 'DefaultLayout';

export default DefaultLayout;
