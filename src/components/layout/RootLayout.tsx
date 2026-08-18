import { Link, Outlet } from 'react-router-dom';

const RootLayout = () => (
  <>
    <header>
      <Link to="/">DWS Blog</Link>
    </header>
    <main>
      <Outlet />
    </main>
  </>
);

export default RootLayout;
