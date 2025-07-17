import { TrashIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof TrashIcon> {
  size?: number;
}

export function Trash({ size = 32, ...props }: Props) {
  return <TrashIcon size={size} {...props} />;
}
