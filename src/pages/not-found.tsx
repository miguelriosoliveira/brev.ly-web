import { Link } from 'react-router';
import notFoundStatusUrl from '../assets/404.svg';

export function NotFoundPage() {
  return (
    <div className="m-auto flex h-full max-w-[580px] flex-col justify-center">
      <div className="flex flex-col items-center gap-5 rounded-lg bg-gray-100 px-6 py-12 sm:px-12 sm:py-16">
        <picture>
          <img
            aria-label="image containing the number 404"
            className="h-20"
            height={80}
            src={notFoundStatusUrl}
            width={180}
          />
        </picture>

        <h2 className="font-xl-bold">Link não encontrado</h2>

        <span className="text-center font-base-semibold text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{' '}
          <Link className="text-blue-base underline" to="/">
            brev.ly
          </Link>
          .
        </span>
      </div>
    </div>
  );
}
