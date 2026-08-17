import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import PostsListPage from '@/pages/PostsListPage';
import PostDetailPage from '@/pages/PostDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <PostsListPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
