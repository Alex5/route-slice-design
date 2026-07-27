/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set by CI from the repository the build came from. Empty in development. */
  readonly VITE_REPO_URL?: string;
}
