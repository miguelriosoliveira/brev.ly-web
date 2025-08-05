import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { z } from 'zod';
import logoIconUrl from './assets/logo.svg';
import { Button } from './components/button';
import { FormField } from './components/form-field';
import { LinkItem } from './components/link-item';
import { DuplicatedLinkError } from './errors/duplicated-link-error';
import { Download } from './icons/download';
import { Link as LinkIcon } from './icons/link';
import { api } from './service/api';

type ShortenedLink = {
  originalLink: string;
  shortLink: string;
  accessCount: number;
};

const formSchema = z.object({
  original_link: z.url(),
  short_link: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export function App() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  function notifyError(title: string, text: string) {
    return toast.error(
      <div className="flex flex-col">
        <strong className="text-base">{title}</strong>
        <span className="text-sm">{text}</span>
      </div>,
      {
        position: 'bottom-right',
        theme: 'colored',
        hideProgressBar: true,
        closeButton: false,
      },
    );
  }

  const onSubmit: SubmitHandler<FormSchema> = ({ original_link, short_link }) => {
    try {
      const newLink = api.createLink({ original_link, short_link });
      setLinks(state => [
        ...state,
        {
          originalLink: newLink.original_link,
          shortLink: newLink.short_link,
          accessCount: newLink.access_count,
        },
      ]);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof DuplicatedLinkError) {
        notifyError(error.title, error.message);
      } else {
        notifyError('Eita!', 'Erro desconhecido ao salvar link.');
      }
    }
  };

  function handleDeleteLink(shortLink: string) {
    const deletedLink = api.deleteLink(shortLink);
    setLinks(state => [...state.filter(link => link.shortLink !== deletedLink)]);
  }

  return (
    <div className="flex h-dvh flex-col items-center gap-6 px-3 py-8">
      {/** biome-ignore lint/performance/noImgElement: Not a Next project */}
      <img aria-label="Brev.ly logo" className="h-7" src={logoIconUrl} />

      <div className="flex w-full flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
          <h2 className="font-lg-bold">Novo link</h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
                hasError={!!errors.short_link}
                id="short_link"
                label="Link encurtado"
                placeholder="brev.ly/"
                type="text"
                {...register('short_link', { required: true })}
              />
            </div>

            <Button type="submit">Salvar link</Button>
          </form>
        </div>

        <div className="flex flex-col gap-4 overflow-hidden rounded-lg bg-gray-100 p-6">
          <header className="flex justify-between">
            <h2 className="font-lg-bold">Meus links</h2>

            <Button disabled={links.length === 0} variant="secondary">
              <Download className="text-gray-600" size={16} />
              Baixar CSV
            </Button>
          </header>

          <main className="scrollbar scrollbar-thumb-blue-base flex flex-col items-center justify-center overflow-auto text-gray-500">
            {links.length > 0 ? (
              links.map(link => (
                <LinkItem
                  accessCount={link.accessCount}
                  key={link.shortLink}
                  onDelete={handleDeleteLink}
                  originalLink={link.originalLink}
                  shortLink={link.shortLink}
                />
              ))
            ) : (
              <div className="w-full place-items-center border-gray-200 border-t pt-5 text-center">
                <LinkIcon className="text-gray-400" />
                <span className="font-xs-uppercase">Ainda não existem links cadastrados</span>
              </div>
            )}
          </main>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
