export interface CreateSecretParams {
  path: string;
  data: Record<string, any>; // Key-value pairs for secret data
  token?: string; // Optional Vault token
}
