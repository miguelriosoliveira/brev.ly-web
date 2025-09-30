import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router';
import { Spinner } from '../icons/spinner';
import { api } from '../service/api';

export function RedirectPage() {
  const { 'url-encurtada': shortUrl } = useParams() as { 'url-encurtada': string };
  const { data: originalUrl, isFetching } = useQuery({
    queryKey: ['redirect'],
    queryFn: () => api.getOriginalUrl(shortUrl),
    retry: 1,
  });

  if (isFetching) {
    return <Spinner />;
  }

  if (!originalUrl) {
    return <Navigate replace to="/url/404" />;
  }

  return (
    <h1>
      the short url "{shortUrl}" should lead to the full url "{originalUrl}"
    </h1>
  );
}
