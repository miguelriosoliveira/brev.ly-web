import { WarningIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof WarningIcon> {
  size?: number;
}

export function Warning({ size = 32, ...props }: Props) {
  return <WarningIcon size={size} {...props} />;
}
