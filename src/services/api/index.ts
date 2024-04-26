export const genericFetcher = (
  input: URL | RequestInfo,
  init?: RequestInit | undefined
) => fetch(input, init).then((res) => res.json());
