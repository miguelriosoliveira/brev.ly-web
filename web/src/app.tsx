import logoIconUrl from './assets/logo-icon.svg';

export function App() {
  return (
    <>
      {/** biome-ignore lint/performance/noImgElement: Not a Next project */}
      <img aria-label="Brev.ly logo" src={logoIconUrl} />
      <h1>hello</h1>
    </>
  );
}
