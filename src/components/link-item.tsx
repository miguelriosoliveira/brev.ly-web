import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import { Copy } from '../icons/copy';
import { Trash } from '../icons/trash';
import { IconButton } from './icon-button';

type Props = {
  shortLink: string;
  originalLink: string;
  accessCount: number;
  onClipboard: (shortLink: string) => void;
  onDelete: (shortLink: string) => void;
};

export function LinkItem({ shortLink, originalLink, accessCount, onClipboard, onDelete }: Props) {
  const fullShortLink = `${window.location.host}/${shortLink}`;

  function handleClipboard(event: MouseEvent) {
    event.preventDefault();
    navigator.clipboard.writeText(fullShortLink);
    onClipboard(shortLink);
  }

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    if (confirm(`Você realmente quer apagar o link ${shortLink}?`)) {
      onDelete(shortLink);
    }
  }

  return (
    <div
      className="flex w-full items-center justify-between gap-4 border-gray-200 border-t py-4"
      key={shortLink}
    >
      <div className="flex flex-auto flex-col overflow-auto">
        <Link className="truncate font-base-semibold text-blue-base" to={fullShortLink}>
          {fullShortLink}
        </Link>
        <span className="truncate text-sm">{originalLink}</span>
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
