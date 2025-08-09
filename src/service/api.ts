import z from 'zod';
import { DuplicatedLinkError } from '../errors/duplicated-link-error';
import { LinkNotFoundError } from '../errors/link-not-found-error';

const linkSchema = z.object({
  id: z.uuid(),
  original_link: z.url(),
  short_link: z.string(),
  access_count: z.number(),
  created_at: z.coerce.date(),
});

type ShortenedLink = z.infer<typeof linkSchema>;

let links: ShortenedLink[] = [];

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

    const newLink: ShortenedLink = {
      id: crypto.randomUUID(),
      original_link,
      short_link,
      access_count: 0,
      created_at: new Date(),
    };
    links = [...links, newLink];

    return newLink;
  },

  deleteLink(shortLink: string): string {
    if (!links.some(link => link.short_link === shortLink)) {
      throw new Error('link not found!');
    }

    links = links.filter(link => link.short_link !== shortLink);

    return shortLink;
  },
};
