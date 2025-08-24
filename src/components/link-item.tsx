import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import { Copy } from '../icons/copy';
import { Trash } from '../icons/trash';
import { IconButton } from './icon-button';

type Props = {
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
  onClipboard: (shortUrl: string) => void;
  onDelete: (shortUrl: string) => void;
};

export function LinkItem({ shortUrl, originalUrl, accessCount, onClipboard, onDelete }: Props) {
  const fullShortUrl = `${window.location.host}/${shortUrl}`;

  function handleClipboard(event: MouseEvent) {
    event.preventDefault();
    navigator.clipboard.writeText(fullShortUrl);
    onClipboard(shortUrl);
  }

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    if (confirm(`Você realmente quer apagar o link ${shortUrl}?`)) {
      onDelete(shortUrl);
    }
  }

  return (
    <div
      className="flex w-full items-center justify-between gap-4 border-gray-200 border-t py-4"
      key={shortUrl}
    >
      <div className="flex flex-auto flex-col overflow-auto">
        <Link
          className="truncate font-base-semibold text-blue-base"
          target="_blank"
          to={{ pathname: shortUrl }}
        >
          {fullShortUrl}
        </Link>
        <span className="truncate text-sm">{originalUrl}</span>
      </div>

      <span className="text-nowrap text-sm">
        {accessCount} {accessCount === 1 ? 'acesso' : 'acessos'}
      </span>

      <div className="flex gap-1">
        <IconButton onClick={handleClipboard}>
          <Copy size={16} />
        </IconButton>

        <IconButton onClick={handleDelete}>
          <Trash size={16} />
        </IconButton>
      </div>
    </div>
  );
}
