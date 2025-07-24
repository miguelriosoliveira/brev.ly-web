import { LinkIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof LinkIcon> {
  size?: number;
}

export function Link({ size = 32, ...props }: Props) {
  return <LinkIcon size={size} {...props} />;
}
