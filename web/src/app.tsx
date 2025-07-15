import logoIconUrl from './assets/logo.svg';
import { Download } from './icons/download';
import { Link } from './icons/link';

export function App() {
  return (
    <div className="flex h-dvh flex-col items-center gap-6 px-3 py-8">
      {/** biome-ignore lint/performance/noImgElement: Not a Next project */}
      <img aria-label="Brev.ly logo" className="h-7" src={logoIconUrl} />

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-5 rounded-lg bg-gray-100 p-6">
          <h2 className="text-lg-bold">Novo link</h2>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-xs-uppercase">
                Link original
                <input
                  className="rounded-lg px-4 py-3.5 text-base text-gray-600 outline outline-gray-300 placeholder:text-gray-400"
                  name="original_link"
                  placeholder="www.exemplo.com.br"
                  type="url"
                />
              </label>

              <label className="flex flex-col gap-2 text-xs-uppercase">
                Link encurtado
                <input
                  className="rounded-lg px-4 py-3.5 text-base text-gray-600 outline outline-gray-300 placeholder:text-gray-400"
                  name="short_link"
                  placeholder="brev.ly/"
                  type="url"
                />
              </label>
            </div>

            <button
              className="rounded-lg bg-blue-base p-5 text-base text-white transition disabled:opacity-50"
              disabled
              type="submit"
            >
              Salvar link
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-gray-100 p-6">
          <header className="flex justify-between">
            <h2 className="text-lg-bold">Meus links</h2>

            <button
              className="flex gap-1.5 rounded-sm bg-gray-200 p-2 text-base text-base-semibold text-gray-500 disabled:opacity-50"
              disabled
              type="button"
            >
              <Download size={16} weight="bold" />
              Baixar CSV
            </button>
          </header>

          <main className="flex flex-col items-center justify-center gap-3 border-gray-200 border-t p-6 text-gray-500">
            <Link className="text-gray-400" />
            <span className="text-xs-uppercase">
              Ainda não existem links cadastrados
            </span>
          </main>
        </div>
      </div>
    </div>
  );
}
