import z from 'zod';
import { DuplicatedLinkError } from '../errors/duplicated-link-error';
import { LinkNotFoundError } from '../errors/link-not-found-error';
import type { ShortenedLink } from '../hooks/use-links';

const linkSchema = z.object({
  id: z.uuid(),
  original_link: z.url(),
  short_link: z.string(),
  access_count: z.number(),
  created_at: z.coerce.date(),
});

type CreateLinkResponse = z.infer<typeof linkSchema>;

let links: CreateLinkResponse[] = [];

type CreateLinkRequest = {
  original_link: string;
  short_link: string;
};

export const api = {
  getOriginalLink(shortLink: string): string {
    const linkFound = links.find(link => link.short_link === shortLink);

    if (!linkFound) {
      throw new LinkNotFoundError();
    }

    return linkFound.original_link;
  },

  createLink({ original_link, short_link }: CreateLinkRequest): ShortenedLink {
    if (links.some(link => link.short_link === short_link)) {
      throw new DuplicatedLinkError();
    }

    const newLink: CreateLinkResponse = {
      id: crypto.randomUUID(),
      original_link,
      short_link,
      access_count: 0,
      created_at: new Date(),
    };
    links = [...links, newLink];

    return {
      id: newLink.id,
      originalLink: newLink.original_link,
      shortLink: newLink.short_link,
      accessCount: newLink.access_count,
      createdAt: newLink.created_at,
    };
  },

  deleteLink(shortLink: string): string {
    const linkFound = links.find(link => link.short_link === shortLink);

    if (!linkFound) {
      throw new Error('link not found!');
    }

    links = links.filter(link => link.short_link !== shortLink);

    return linkFound.id;
  },
};
