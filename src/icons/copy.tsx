import { CopyIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof CopyIcon> {
  size?: number;
}

export function Copy({ size = 32, ...props }: Props) {
  return <CopyIcon size={size} {...props} />;
}
