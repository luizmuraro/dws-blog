import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader/AppHeader';

const RootLayout = () => (
  <>
    <AppHeader />
    <main>
      <Outlet />
    </main>
  </>
);

export default RootLayout;
