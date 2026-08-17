import { Link, Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <header>
        <Link to="/">DWS Blog</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
