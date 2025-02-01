import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithRetry(dynamicImportFn: () => any) {
  return lazy(() =>
    dynamicImportFn().catch(() => {
      window.location.reload();
    }),
  );
}

export const routes = {
  root: '/',
} as const;

export const router = createBrowserRouter([
  {
    path: routes.root,
    Component: lazyWithRetry(() => import('@/layouts/default-layout')),
    children: [
      {
        path: routes.root,
        Component: lazyWithRetry(() => import('@/pages/home')),
      },
      {
        path: '*',
        Component: lazyWithRetry(() => import('@/pages/home')),
      },
    ],
  },
]);
