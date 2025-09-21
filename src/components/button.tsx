import type { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

export interface Props extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

const variants = tv({
  base: 'flex cursor-pointer items-center justify-center gap-1.5 p-2 text-base transition disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    color: {
      primary: 'rounded-lg bg-blue-base p-4 text-white hover:bg-blue-dark disabled:bg-blue-base',
      secondary:
        'rounded-sm bg-gray-200 p-2 font-sm-semibold text-gray-500 outline-blue-dark hover:outline disabled:outline-0',
    },
  },
  defaultVariants: { color: 'primary' },
});

export function Button({ type = 'button', variant = 'primary', children, ...props }: Props) {
  return (
    <button className={variants({ color: variant })} type={type} {...props}>
      {children}
    </button>
  );
}
