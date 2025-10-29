import logoUrl from '../assets/logo.svg';
import { LinkForm } from '../components/link-form';
import { LinksList } from '../components/links-list';
import { LinksProvider } from '../hooks/use-links';

export function HomePage() {
  return (
    <div className="flex h-full flex-col items-center sm:items-start gap-6 max-w-[980px] m-auto">
      <picture>
        <img
          aria-label="Brev.ly logo (icon and name)"
          className="h-7"
          height={25}
          src={logoUrl}
          width={100}
        />
      </picture>

      <div className="flex flex-col gap-3 overflow-hidden sm:grid sm:gap-5 sm:grid-cols-[minmax(auto,380px)_1fr] w-full">
        <LinksProvider>
          <LinkForm />
          <LinksList />
        </LinksProvider>
      </div>
    </div>
  );
}
//
