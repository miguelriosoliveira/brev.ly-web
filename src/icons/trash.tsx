import { type IconProps, TrashIcon } from '@phosphor-icons/react';

export function Trash({ size = 32, ...props }: IconProps) {
  return <TrashIcon size={size} {...props} />;
}
