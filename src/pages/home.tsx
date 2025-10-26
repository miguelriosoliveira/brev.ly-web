import logoUrl from '../assets/logo.svg';
import { LinkForm } from '../components/link-form';
import { LinksList } from '../components/links-list';
import { LinksProvider } from '../hooks/use-links';

export function HomePage() {
  return (
    <div className="flex h-full flex-col items-center gap-6">
      <picture>
        <img
          aria-label="Brev.ly logo (icon and name)"
          className="h-7"
          height={25}
          src={logoUrl}
          width={100}
        />
      </picture>

      <div className="flex w-full flex-col gap-3 overflow-hidden">
        <LinksProvider>
          <LinkForm />
          <LinksList />
        </LinksProvider>
      </div>
    </div>
  );
}
//
