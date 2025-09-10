import { type IconProps, SpinnerIcon } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

export function Spinner({ size = 32, className, ...props }: IconProps) {
  return <SpinnerIcon size={size} {...props} className={twMerge(className, 'animate-spin')} />;
}
