export interface GetSecretParams {
  rootPath?: string; // Optional Vault root path
  path: string;
  token?: string; // Optional Vault token
}
