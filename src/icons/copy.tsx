import { CopyIcon, type IconProps } from '@phosphor-icons/react';

export function Copy({ size = 32, ...props }: IconProps) {
  return <CopyIcon size={size} {...props} />;
}
