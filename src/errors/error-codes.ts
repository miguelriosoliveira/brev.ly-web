import { DuplicateUrlError } from './duplicated-link-error';

export const ERROR_CODES = ['DUPLICATE_URL', 'UNKNOWN_ERROR'] as const;
type ErrorCodeKey = (typeof ERROR_CODES)[number];

export const ErrorCodes: Record<ErrorCodeKey, Error> = {
  DUPLICATE_URL: new DuplicateUrlError(),
  UNKNOWN_ERROR: new Error('unknown error'),
} as const;
