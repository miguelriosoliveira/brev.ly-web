export class DuplicatedLinkError extends Error {
  title = 'Erro no cadastro';
  message = 'Essa URL encurtada já existe.';
}
