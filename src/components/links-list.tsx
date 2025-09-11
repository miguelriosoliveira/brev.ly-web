import { useInfiniteQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useLinks } from '../hooks/use-links';
import { Download } from '../icons/download';
import { Link as LinkIcon } from '../icons/link';
import { Spinner } from '../icons/spinner';
import { api } from '../service/api';
import { notify } from '../service/toast';
import { Button } from './button';
import { IconMessage } from './icon-message';
import { LinkItem } from './link-item';

export function LinksList() {
  const { removeLink } = useLinks();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetched } =
    useInfiniteQuery({
      queryKey: ['links'],
      queryFn: ({ pageParam }) => api.getLinks(pageParam),
      initialPageParam: '',
      getNextPageParam: lastPage => lastPage.nextCursor,
    });

  // Sentinel and scroll-root refs
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = scrollRootRef.current;
    const target = sentinelRef.current;
    if (!(root && target)) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetching && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root, // observe visibility within the scrollable container
        threshold: 0,
      },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  function handleDownloadCsv() {
    if (linksPage.items.length === 0) {
      return;
    }

    const csvRows = [
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created at'],
      ...linksPage.items.map(link => [
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

        <Button disabled={data?.pages.length === 0} onClick={handleDownloadCsv} variant="secondary">
          <Download className="text-gray-600" size={16} />
          Baixar CSV
        </Button>
      </header>

      <main
        className="scrollbar scrollbar-thumb-blue-base flex flex-col items-center overflow-auto text-gray-500"
        ref={scrollRootRef}
      >
        {isFetched ? (
          data?.pages.flatMap(linksPage => linksPage.items).length ? (
            data?.pages.map(linksPage =>
              linksPage.items.map(link => (
                <LinkItem
                  accessCount={link.accessCount}
                  key={link.id}
                  onClipboard={handleClipboard}
                  onDelete={handleDeleteLink}
                  originalUrl={link.originalUrl}
                  shortUrl={link.shortUrl}
                />
              )),
            )
          ) : (
            <IconMessage Icon={LinkIcon} message="Ainda não existem links cadastrados" />
          )
        ) : (
          <IconMessage Icon={Spinner} message="Carregando links..." />
        )}

        {hasNextPage && (
          <IconMessage Icon={Spinner} message="Carregando links..." ref={sentinelRef} />
        )}
      </main>
    </div>
  );
}
