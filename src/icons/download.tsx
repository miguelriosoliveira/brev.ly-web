import { DownloadSimpleIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof DownloadSimpleIcon> {
  size?: number;
}

export function Download({ size = 32, ...props }: Props) {
  return <DownloadSimpleIcon size={size} {...props} />;
}
