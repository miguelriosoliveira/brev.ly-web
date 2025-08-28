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

const linksSchema = z.array(linkSchema);

const errorSchema = z.object({ error_code: z.enum(ERROR_CODES) });

type LinkSchema = z.infer<typeof linkSchema>;

type CreateLinkRequest = {
  original_url: string;
  short_url: string;
};

type ErrorResponse = z.infer<typeof errorSchema>;

let links: LinkSchema[] = [];

const apiFetch = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  async getLinks(): Promise<ShortenedLink[]> {
    const response = await apiFetch.get<LinkSchema[]>('/urls');
    return linksSchema.parse(response.data).map(link => ({
      id: link.id,
      originalUrl: link.original_url,
      shortUrl: link.short_url,
      accessCount: link.access_count,
      createdAt: link.created_at,
    }));
  },

  getOriginalUrl(shortUrl: string): string {
    const linkFound = links.find(link => link.short_url === shortUrl);

    if (!linkFound) {
      throw new LinkNotFoundError();
    }

    return linkFound.original_url;
  },

  async createLink({ original_url, short_url }: CreateLinkRequest): Promise<ShortenedLink> {
    try {
      const response = await apiFetch.post<LinkSchema[]>('/urls', {
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
