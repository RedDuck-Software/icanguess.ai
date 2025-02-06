/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REOWN_PROJECT_ID: string;
  readonly VITE_API_BASE_URL: string;
  readonly ENVIRONMENT: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
