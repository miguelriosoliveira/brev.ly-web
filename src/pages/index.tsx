import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import z from 'zod';
import logoIconUrl from '../assets/logo.svg';
import { Button } from '../components/button';
import { FormField } from '../components/form-field';
import { LinkItem } from '../components/link-item';
import { DuplicatedLinkError } from '../errors/duplicated-link-error';
import { Download } from '../icons/download';
import { Link as LinkIcon } from '../icons/link';
import { api } from '../service/api';
import { notify } from '../service/toast';

type ShortenedLink = {
  id: string;
  originalLink: string;
  shortLink: string;
  accessCount: number;
  createdAt: Date;
};

const formSchema = z.object({
  original_link: z.url('Informe uma url válida.'),
  short_link: z
    .string()
    .min(1, 'URL encurtado não pode estar vazio.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Informe uma URL minúscula e sem espaço/caracter especial.',
    ),
});

type FormSchema = z.infer<typeof formSchema>;

export function IndexPage() {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

  const onSubmit: SubmitHandler<FormSchema> = ({ original_link, short_link }) => {
    try {
      const newLink = api.createLink({ original_link, short_link });
      setLinks(state => [
        ...state,
        {
          id: newLink.id,
          originalLink: newLink.original_link,
          shortLink: newLink.short_link,
          accessCount: newLink.access_count,
          createdAt: newLink.created_at,
        },
      ]);
      resetForm();
    } catch (error: unknown) {
      if (error instanceof DuplicatedLinkError) {
        notify({ type: 'error', title: error.title, text: error.message });
      } else {
        notify({
          type: 'error',
          title: 'Eita!',
          text: 'Erro desconhecido ao salvar link.',
        });
      }
    }
  };

  function handleDownloadCsv() {
    if (links.length === 0) {
      return;
    }

    const csvRows = [
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
      ...links.map(link => [
        link.id,
        link.originalLink,
        link.shortLink,
        link.accessCount,
        dayjs(link.createdAt).format('YYYY-MM-DD HH:mm:ss.SSS'),
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClipboard(shortLink: string) {
    notify({
      type: 'info',
      title: 'Link copiado com sucesso',
      text: `O link ${shortLink} foi copiado para a área de transferência`,
    });
  }

  function handleDeleteLink(shortLink: string) {
    const deletedLink = api.deleteLink(shortLink);
    setLinks(state => [...state.filter(link => link.shortLink !== deletedLink)]);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <picture>
        <img aria-label="Brev.ly logo" className="h-7" src={logoIconUrl} />
      </picture>

      <div className="flex w-full flex-col gap-3 overflow-hidden">
        <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
          <h2 className="font-lg-bold">Novo link</h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                error={errors.original_link?.message}
                id="original_link"
                label="Link original"
                placeholder="www.exemplo.com.br"
                type="url"
                {...register('original_link', { required: true })}
              />

              <FormField
                error={errors.short_link?.message}
                fixedPlaceholder
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

            <Button disabled={links.length === 0} onClick={handleDownloadCsv} variant="secondary">
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
                  onClipboard={handleClipboard}
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
