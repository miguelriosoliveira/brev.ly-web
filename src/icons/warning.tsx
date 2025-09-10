import { type IconProps, WarningIcon } from '@phosphor-icons/react';

export function Warning({ size = 32, ...props }: IconProps) {
  return <WarningIcon size={size} {...props} />;
}
