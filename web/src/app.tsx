import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import logoIconUrl from './assets/logo.svg';
import { FormField } from './components/form-field';
import { Download } from './icons/download';
import { Link as LinkIcon } from './icons/link';

type ShortenedLink = {
  originalLink: string;
  shortLink: string;
  accessCount: number;
};

type Inputs = {
  original_link: string;
  short_link: string;
};

export function App() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
  };

  return (
    <div className="flex h-dvh flex-col items-center gap-6 px-3 py-8">
      {/** biome-ignore lint/performance/noImgElement: Not a Next project */}
      <img aria-label="Brev.ly logo" className="h-7" src={logoIconUrl} />

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
          <h2 className="text-lg-bold">Novo link</h2>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <FormField
                errorMessage="Informe uma url válida."
                hasError={!!errors.original_link}
                id="original_link"
                label="Link original"
                placeholder="www.exemplo.com.br"
                type="url"
                {...register('original_link', { required: true })}
              />

              <FormField
                errorMessage="Informe uma url minúscula e sem espaço/caracter especial."
                fixedPlaceholder
                hasError={!!errors.original_link}
                id="short_link"
                label="Link encurtado"
                placeholder="brev.ly/"
                type="text"
                {...register('short_link', { required: true })}
              />
            </div>

            <button
              className="rounded-lg bg-blue-base p-5 text-base text-white transition disabled:opacity-50"
              type="submit"
            >
              Salvar link
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-6">
          <header className="flex justify-between">
            <h2 className="text-lg-bold">Meus links</h2>

            <button
              className="flex items-center gap-1.5 rounded-sm bg-gray-200 p-2 text-base text-base-semibold text-gray-500 disabled:opacity-50"
              disabled={links.length === 0}
              type="button"
            >
              <Download className="text-gray-600" size={16} weight="bold" />
              Baixar CSV
            </button>
          </header>

          <main className="flex flex-col items-center justify-center gap-3 border-gray-200 border-t p-6 text-gray-500">
            {links.length > 0 ? (
              links.map(link => (
                <Link key={link.shortLink} to={link.shortLink}>
                  {link.shortLink}
                </Link>
              ))
            ) : (
              <>
                <LinkIcon className="text-gray-400" />
                <span className="text-xs-uppercase">
                  Ainda não existem links cadastrados
                </span>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
