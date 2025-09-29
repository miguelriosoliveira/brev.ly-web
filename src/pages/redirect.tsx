import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../service/api';
import { useQuery } from '@tanstack/react-query';

export function RedirectPage() {
  const { 'url-encurtada': shortUrl } = useParams();
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
	const {} = useQuery({
		queryKey:['redirect'],
		queryFn: () => api.getOriginalUrl(shortUrl!)
	})

  // useEffect(() => {
  //   if (!shortUrl) {
  //     return;
  //   }
  //   setOriginalUrl(api.getOriginalUrl(shortUrl));
  // }, [shortUrl]);

  return (
    <h1>
      the short url "{shortUrl}" should lead to the full url "{originalUrl}"
    </h1>
  );
}
