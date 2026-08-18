import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader/AppHeader';
import BackgroundDecor from './BackgroundDecor/BackgroundDecor';

const RootLayout = () => (
  <>
    <BackgroundDecor />
    <AppHeader />
    <main>
      <Outlet />
    </main>
  </>
);

export default RootLayout;
