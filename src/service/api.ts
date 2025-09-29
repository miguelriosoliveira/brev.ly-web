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
type ApiLink = z.infer<typeof LINK_SCHEMA>;

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

const apiFetch = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  async getLinks(cursor?: string): Promise<LinksPage> {
    const { data } = await apiFetch.get('/urls', { params: { cursor: cursor || undefined } });
    const response = LINKS_PAGE_SCHEMA.parse(data);
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
    try {
      const response = await apiFetch.post<ApiLink[]>('/urls', {
        original_url,
        short_url,
      });
      const newLink = LINK_SCHEMA.parse(response.data);
      return {
        id: newLink.id,
        originalUrl: newLink.original_url,
        shortUrl: newLink.short_url,
        accessCount: newLink.access_count,
        createdAt: newLink.created_at,
      };
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

	async getOriginalUrl(shortUrl: string) {

	}
};
