/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    accept: (deps?: string | string[], callback?: Function) => void;
    dispose: (callback: (data: any) => void) => void;
    invalidate: () => void;
    on: (event: string, callback: Function) => void;
  };
}