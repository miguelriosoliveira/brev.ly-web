import axios, { type AxiosError } from 'axios';
import z from 'zod';
import { env } from '../env';
import { ERROR_CODES, ErrorCodes } from '../errors/error-codes';
import type { ShortenedLink } from '../hooks/use-links';

const LINK_SCHEMA = z.object({
  id: z.uuidv7(),
  original_url: z.url(),
  short_url: z.string(),
  access_count: z.number(),
  created_at: z.coerce.date(),
});

const LINKS_PAGE_SCHEMA = z.object({
  items: z.array(LINK_SCHEMA),
  next_cursor: z.uuidv7().nullable(),
  total: z.number(),
});
type LinksPage = {
  items: ShortenedLink[];
  nextCursor: string | null;
  total: number;
};

const ERROR_SCHEMA = z.object({
  error_code: z.enum(ERROR_CODES),
});
type ApiError = z.infer<typeof ERROR_SCHEMA>;

type CreateLinkRequest = {
  original_url: string;
  short_url: string;
};

const FILENAME_REGEX = /filename="?([^"]+)"?/;

const ORIGINAL_URL_SCHEMA = z.object({
  original_url: LINK_SCHEMA.shape.original_url,
});

const DELETED_URL_SCHEMA = z.object({
  id: LINK_SCHEMA.shape.id,
});

const apiFetch = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function handleFetch<T>(
  fetchFunction: () => Promise<{ data: unknown }>,
  schemaParser: z.ZodType<T>,
): Promise<T> {
  try {
    const { data } = await fetchFunction();
    return schemaParser.parse(data);
  } catch (error) {
    const axiosErr = error as AxiosError<ApiError>;
    if (axiosErr.response?.data) {
      const parsed = ERROR_SCHEMA.safeParse(axiosErr.response.data);
      if (!parsed.success) {
        throw ErrorCodes.UNKNOWN_ERROR;
      }
      throw ErrorCodes[parsed.data.error_code] || ErrorCodes.UNKNOWN_ERROR;
    }
    throw error;
  }
}

export const api = {
  async getLinks(cursor?: string): Promise<LinksPage> {
    const response = await handleFetch(
      () => apiFetch.get('/urls', { params: { cursor: cursor || undefined } }),
      LINKS_PAGE_SCHEMA,
    );
    return {
      items: response.items.map(link => ({
        id: link.id,
        originalUrl: link.original_url,
        shortUrl: link.short_url,
        accessCount: link.access_count,
        createdAt: link.created_at,
      })),
      nextCursor: response.next_cursor,
      total: response.total,
    };
  },

  async createLink({ original_url, short_url }: CreateLinkRequest): Promise<ShortenedLink> {
    const newLink = await handleFetch(
      () => apiFetch.post('/urls', { original_url, short_url }),
      LINK_SCHEMA,
    );
    return {
      id: newLink.id,
      originalUrl: newLink.original_url,
      shortUrl: newLink.short_url,
      accessCount: newLink.access_count,
      createdAt: newLink.created_at,
    };
  },

  async downloadCsv() {
    try {
      const { headers, data: body } = await apiFetch.get('/downloads', { responseType: 'text' });

      const contentDisposition = headers['content-disposition'];
      const filename =
        FILENAME_REGEX.exec(contentDisposition)?.at(1) || `${crypto.randomUUID()}_links.csv`;

      return { body, filename };
    } catch (error) {
      const axiosErr = error as AxiosError<ApiError>;
      if (axiosErr.response?.data) {
        const parsed = ERROR_SCHEMA.safeParse(axiosErr.response.data);
        if (!parsed.success) {
          throw ErrorCodes.UNKNOWN_ERROR;
        }
        throw ErrorCodes[parsed.data.error_code] || ErrorCodes.UNKNOWN_ERROR;
      }
      throw error;
    }
  },

  async getOriginalUrl(shortUrl: string): Promise<string> {
    const response = await handleFetch(
      () => apiFetch.get(`/urls/${shortUrl}`),
      ORIGINAL_URL_SCHEMA,
    );
    return response.original_url;
  },

  async deleteUrl(shortUrl: string): Promise<string> {
    const response = await handleFetch(
      () => apiFetch.delete(`/urls/${shortUrl}`),
      DELETED_URL_SCHEMA,
    );
    return response.id;
  },
};
