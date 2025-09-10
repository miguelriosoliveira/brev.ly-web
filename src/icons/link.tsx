import { type IconProps, LinkIcon } from '@phosphor-icons/react';

export function Link({ size = 32, ...props }: IconProps) {
  return <LinkIcon size={size} {...props} />;
}
