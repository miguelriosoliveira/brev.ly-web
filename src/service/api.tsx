type ShortenedLink = {
  original_link: string;
  short_link: string;
  access_count: number;
};

let links: ShortenedLink[] = [];

type CreateLinkRequest = {
  original_link: string;
  short_link: string;
};

export const api = {
  createLink({ original_link, short_link }: CreateLinkRequest): ShortenedLink {
    if (links.some(link => link.short_link === short_link)) {
      throw new Error('link already exists!');
    }

    const newLink: ShortenedLink = {
      original_link,
      short_link,
      access_count: 0,
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
