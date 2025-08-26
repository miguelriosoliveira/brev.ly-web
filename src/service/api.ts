import axios, { type AxiosError } from 'axios';
import z from 'zod';
import { env } from '../env';
import { ERROR_CODES, ErrorCodes } from '../errors/error-codes';
import { LinkNotFoundError } from '../errors/link-not-found-error';
import type { ShortenedLink } from '../hooks/use-links';

const linkSchema = z.object({
  id: z.uuid(),
  original_url: z.url(),
  short_url: z.string(),
  access_count: z.number(),
  created_at: z.coerce.date(),
});

const errorSchema = z.object({ error_code: z.enum(ERROR_CODES) });

type CreateLinkResponse = z.infer<typeof linkSchema>;
type ErrorResponse = z.infer<typeof errorSchema>;

let links: CreateLinkResponse[] = [];

type CreateLinkRequest = {
  original_url: string;
  short_url: string;
};

// function apiFetch(path: string, init?: RequestInit) {
//   const url = new URL(path, env.VITE_BACKEND_URL).toString();
//   const headers = {
//     'Content-Type': 'application/json',
//     ...init?.headers,
//   };
//   return fetch(url, { ...init, headers });
// }

const apiFetch = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  getOriginalUrl(shortUrl: string): string {
    const linkFound = links.find(link => link.short_url === shortUrl);

    if (!linkFound) {
      throw new LinkNotFoundError();
    }

    return linkFound.original_url;
  },

  async createLink({ original_url, short_url }: CreateLinkRequest): Promise<ShortenedLink> {
    try {
      const response = await apiFetch.post<CreateLinkResponse>('/urls', {
        original_url,
        short_url,
      });
      const newLink = linkSchema.parse(response.data);
      return {
        id: newLink.id,
        originalUrl: newLink.original_url,
        shortUrl: newLink.short_url,
        accessCount: newLink.access_count,
        createdAt: newLink.created_at,
      };
    } catch (error) {
      const axiosErr = error as AxiosError<ErrorResponse>;
      if (axiosErr.response?.data) {
        const parsed = errorSchema.safeParse(axiosErr.response.data);
        if (!parsed.success) {
          throw ErrorCodes.UNKNOWN_ERROR;
        }
        const err = ErrorCodes[parsed.data.error_code];
        if (!err) {
          throw ErrorCodes.UNKNOWN_ERROR;
        }
        throw err;
      }
      throw error;
    }
  },

  deleteLink(shortUrl: string): string {
    const linkFound = links.find(link => link.short_url === shortUrl);

    if (!linkFound) {
      throw new Error('link not found!');
    }

    links = links.filter(link => link.short_url !== shortUrl);

    return linkFound.id;
  },
};
