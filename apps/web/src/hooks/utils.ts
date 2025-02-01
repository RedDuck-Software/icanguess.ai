import type { Fetcher } from '@/lib/fetcher';

export const get = async <T>(fetcher: Fetcher, method: string) => {
  const response = await fetcher.get<T>(method);
  if (!(response.status >= 200 && response.status < 300)) {
    throw new Error(response.statusText);
  }

  return response.data!;
};

export const put = async <T>(
  client: Fetcher,
  method: string,
  data: Record<string, unknown>,
) => {
  const response = await client.put<T>(method, { data });
  if (!(response.status >= 200 && response.status < 300)) {
    throw new Error(response.statusText);
  }

  return response.data;
};

export const post = async <T>(
  client: Fetcher,
  method: string,
  body?: Record<string, unknown>,
) => {
  const response = await client.post<T>(method, body);
  if (!(response.status >= 200 && response.status < 300)) {
    throw new Error(response.statusText);
  }

  return response.data;
};
