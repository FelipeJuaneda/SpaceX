export class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string) {
    super(`Request to ${url} failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new HttpError(res.status, url);
  return (await res.json()) as T;
}

export function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.isNotFound;
}
