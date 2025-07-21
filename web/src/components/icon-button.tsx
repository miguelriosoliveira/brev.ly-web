import type { ComponentProps } from 'react';
import { Button } from './button';

export interface Props extends ComponentProps<'button'> {}

export function IconButton({ type = 'button', children, ...props }: Props) {
  return (
    <Button type={type} variant="secondary" {...props}>
      {children}
    </Button>
  );
}
