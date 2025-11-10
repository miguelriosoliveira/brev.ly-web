import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import logoIconUrl from '../assets/logo-icon.svg';
import { api } from '../service/api';

export function RedirectPage() {
  const { 'url-encurtada': shortUrl } = useParams() as { 'url-encurtada': string };
  const { data: originalUrl, isFetched } = useQuery({
    queryKey: ['redirect'],
    queryFn: () => api.getOriginalUrl(shortUrl),
    retry: 1,
  });

  useEffect(() => {
    if (originalUrl) {
      window.location.replace(originalUrl);
    }
  }, [originalUrl]);

  if (isFetched && !originalUrl) {
    return <Navigate replace to="/url/404" />;
  }

  return (
    <div className="m-auto flex h-full max-w-[580px] flex-col justify-center">
      <div className="flex flex-col items-center gap-5 rounded-lg bg-gray-100 px-6 py-12 sm:px-12 sm:py-16">
        <picture>
          <img
            aria-label="Brev.ly logo icon"
            className="h-20"
            height={48}
            src={logoIconUrl}
            width={48}
          />
        </picture>

        <h2 className="font-xl-bold">Redirecionando...</h2>

        <span className="text-center font-base-semibold text-gray-500">
          O link será aberto automaticamente em alguns instantes.
          {!!originalUrl && (
            <>
              <br />
              Não foi redirecionado?{' '}
              <Link className="text-blue-base underline" to={originalUrl}>
                Acesse aqui
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
