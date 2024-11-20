export interface VaultClientConfig {
  baseURL: string;
  rootPath: string;
  appRole: string;
  roleId: string;
  secretId: string;
  logging?: boolean;
}
