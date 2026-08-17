import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{getErrorMessage(error)}</p>
      <Link to="/">Back to home</Link>
    </main>
  );
}

export default RouteErrorBoundary;
