/// <reference types="vite/client" />

declare module '*.json' {
  const value: Record<string, import('./global-types').ConfigData>;
  export default value;
}