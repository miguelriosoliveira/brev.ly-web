export class LinkNotFoundError extends Error {
  title = 'URL inválida';
  message = 'Essa URL encurtada não foi encontrada.';
}
