export function handleError(error: unknown) {
  console.error(error);

  throw new Error(typeof error === 'string' ? error : JSON.stringify(error));
}
