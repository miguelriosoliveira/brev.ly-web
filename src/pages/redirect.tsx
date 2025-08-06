import { useParams } from 'react-router';

export function RedirectPage() {
  const { shortUrl } = useParams();
  return <h1>REDIRECTING TO {shortUrl}...</h1>;
}
