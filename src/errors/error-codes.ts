import { DuplicateUrlError } from './duplicated-link-error';

export const ErrorCodes: Record<string, Error> = {
  DUPLICATE_URL: new DuplicateUrlError(),
} as const;
