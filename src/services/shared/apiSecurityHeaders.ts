import { AxiosRequestConfig } from 'axios';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';

type ApiSecurityConfig = {
  matchers: string[];
  apiKey: string;
  headerName?: string;
};

const API_SECURITY_CONFIGS: ApiSecurityConfig[] = [
  {
    matchers: ['makebe-session', 'session', 'sessao'],
    apiKey: '684b3b6f-e7e3-4763-918f-2de3ec05f306',
  },
  {
    matchers: ['makebe-agenda', 'agenda'],
    apiKey: '9bc8e4b0-bdef-4cb5-b8e8-4078308d0ab9',
    headerName: 'ApiSecurity',
  },
];

const DEFAULT_API_SECURITY_HEADER = 'ApiSecurity';

const getApiSecurityConfig = (url: string): ApiSecurityConfig | undefined => {
  const normalizedUrl = url.toLowerCase();
  return API_SECURITY_CONFIGS.find(({ matchers }) =>
    matchers.some((matcher) => normalizedUrl.includes(matcher.toLowerCase())),
  );
};

export const buildRequestConfig = (url: string): AxiosRequestConfig => {
  const token = getTokenFromLocalStorage();
  const apiSecurityConfig = getApiSecurityConfig(url);

  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(apiSecurityConfig
        ? {
            [apiSecurityConfig.headerName ?? DEFAULT_API_SECURITY_HEADER]:
              apiSecurityConfig.apiKey,
          }
        : {}),
    },
  };
};
