import { Navigate, useParams } from 'react-router';

export function RedirectPage() {
  const { shortUrl } = useParams();

  if (shortUrl === 'url-que-nao-existe') {
    return <Navigate replace to="/url/not-found" />;
  }

  return <h1>REDIRECTING TO {shortUrl}...</h1>;
}
