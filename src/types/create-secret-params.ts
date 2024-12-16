export interface CreateSecretParams {
  rootPath?: string; // Optional Vault root path
  path: string;
  data: Record<string, any>; // Key-value pairs for secret data
  token?: string; // Optional Vault token
}
