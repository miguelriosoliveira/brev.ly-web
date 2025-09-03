import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useLinks } from '../hooks/use-links';
import { Download } from '../icons/download';
import { Link as LinkIcon } from '../icons/link';
import { api } from '../service/api';
import { notify } from '../service/toast';
import { Button } from './button';
import { LinkItem } from './link-item';

export function LinksList() {
  const { removeLink } = useLinks();
  const { data: linksPage = { items: [], nextCursor: null, total: 0 } } = useQuery({
    queryKey: ['links'],
    queryFn: api.getLinks,
  });

  function handleDownloadCsv() {
    if (linksPage.length === 0) {
      return;
    }

    const csvRows = [
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
      ...linksPage.map(link => [
        link.id,
        link.originalUrl,
        link.shortUrl,
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

  function handleClipboard(shortUrl: string) {
    notify({
      type: 'info',
      title: 'Link copiado com sucesso',
      text: `O link ${shortUrl} foi copiado para a área de transferência`,
    });
  }

  function handleDeleteLink(shortUrl: string) {
    const linkId = api.deleteLink(shortUrl);
    removeLink(linkId);
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-lg bg-gray-100 p-6">
      <header className="flex justify-between">
        <h2 className="font-lg-bold">Meus links</h2>

        <Button
          disabled={linksPage.items.length === 0}
          onClick={handleDownloadCsv}
          variant="secondary"
        >
          <Download className="text-gray-600" size={16} />
          Baixar CSV
        </Button>
      </header>

      <main className="scrollbar scrollbar-thumb-blue-base flex flex-col items-center justify-center overflow-auto text-gray-500">
        {linksPage.items.length > 0 ? (
          linksPage.items.map(link => (
            <LinkItem
              accessCount={link.accessCount}
              key={link.id}
              onClipboard={handleClipboard}
              onDelete={handleDeleteLink}
              originalUrl={link.originalUrl}
              shortUrl={link.shortUrl}
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
  );
}
