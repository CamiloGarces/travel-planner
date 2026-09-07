export const json = (statusCode: number, body?: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? '' : JSON.stringify(body),
});

export function userId(event: any) {
  const id = event.requestContext?.authorizer?.jwt?.claims?.sub;

  if (!id || typeof id !== 'string') {
    throw new Error('Missing authenticated user');
  }

  return id;
}
