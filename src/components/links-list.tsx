import {
  useInfiniteQuery,
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLinks } from '../hooks/use-links';
import { Download } from '../icons/download';
import { Link as LinkIcon } from '../icons/link';
import { Spinner } from '../icons/spinner';
import { api } from '../service/api';
import { notify } from '../service/toast';
import { Button } from './button';
import { IconMessage } from './icon-message';
import { LinearLoader } from './linear-loader/linear-loader';
import { LinkItem } from './link-item';

export function LinksList() {
  const { removeLink } = useLinks();
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetched } =
    useInfiniteQuery({
      queryKey: ['links'],
      queryFn: ({ pageParam }) => api.getLinks(pageParam),
      initialPageParam: '',
      getNextPageParam: lastPage => lastPage.nextCursor,
    });
  const { refetch: fetchCsv, isFetching: isFetchingCsv } = useQuery({
    enabled: false,
    queryKey: ['download'],
    queryFn: api.downloadCsv,
  });
  const mutationCount = useIsMutating();
  const mutation = useMutation({
    mutationFn(shortUrl: string) {
      return api.deleteUrl(shortUrl);
    },
    onSuccess(linkId) {
      removeLink(linkId);
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError() {
      notify({ type: 'error', title: 'Eita!', text: 'Erro ao deletar link.' });
    },
  });

  const isSavingUrl = mutationCount > 0;
  const links = data?.pages.flatMap(linksPage => linksPage.items) || [];
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
      { root, threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  function handleDownloadCsv() {
    fetchCsv().then(result => {
      if (!result.data) {
        notify({ type: 'error', title: 'Erro', text: 'Falha ao baixar CSV.' });
        return;
      }

      const { body: csvContent, filename } = result.data;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  function handleClipboard(shortUrl: string) {
    notify({
      type: 'info',
      title: 'Link copiado com sucesso',
      text: `O link ${shortUrl} foi copiado para a área de transferência`,
    });
  }

  function handleDeleteLink(shortUrl: string) {
    mutation.mutate(shortUrl);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg">
      {(isFetching || isSavingUrl) && <LinearLoader />}

      <div className="flex flex-col gap-4 overflow-hidden bg-gray-100 p-6 sm:p-8">
        <header className="flex justify-between">
          <h2 className="font-lg-bold">Meus links</h2>

          <Button
            disabled={links.length === 0 || isFetchingCsv}
            onClick={handleDownloadCsv}
            variant="secondary"
          >
            {isFetchingCsv ? <Spinner size={16} /> : <Download size={16} />}
            Baixar CSV
          </Button>
        </header>

        <main
          className="scrollbar scrollbar-thumb-blue-base flex flex-col items-center overflow-auto pr-1.5 text-gray-500"
          ref={scrollRootRef}
        >
          {isFetched ? (
            links.length ? (
              links.map(link => (
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
    </div>
  );
}
