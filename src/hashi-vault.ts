import { contentTypes, create_instance, methods } from "fetcher";
import { VaultClientConfig } from "./types/vault-client-config";
import { GetSecretParams } from "./types/get-secret-params";
import { CreateSecretParams } from "./types/create-secret-params";
// import { logging } from "./decorators/logging.decorator";

export class HashiVault {
  private fetcher: ReturnType<typeof create_instance>;
  private rootPath: string;
  private appRole: string;
  private roleId: string;
  private secretId: string;
  private clientToken: string | null = null;
  private tokenExpiration: number | null = null;
  private logging: boolean;

  /**
   * @param {VaultClientConfig} config - Configuration object for HashiVault
   */
  constructor({
    baseURL,
    rootPath,
    appRole,
    roleId,
    secretId,
    logging = false,
  }: VaultClientConfig) {
    this.fetcher = create_instance({
      baseURL,
      logging: logging,
    });
    this.rootPath = rootPath;
    this.appRole = appRole;
    this.roleId = roleId;
    this.secretId = secretId;
    this.logging = logging;
  }

  /**
   * Perform a health check on the Vault server
   * @returns {Promise<any>} - Response data from the health check
   */
  //   @logging(true)
  async healthCheck(): Promise<any> {
    const response = await this.fetcher({
      method: methods.get,
      url: "/sys/health",
      contentType: contentTypes.json,
    });

    return response.data;
  }

  /**
   * Authenticate with AppRole to get a new client token
   * @returns {Promise<void>}
   */
  private async authenticate(): Promise<void> {
    const response = await this.fetcher({
      method: methods.post,
      url: `/auth/${this.appRole}/login`,
      contentType: contentTypes.json,
      body: {
        role_id: this.roleId,
        secret_id: this.secretId,
      },
    });

    const data = response.data;
    this.clientToken = data.auth.client_token;
    this.tokenExpiration = Date.now() + data.auth.lease_duration * 1000; // Convert seconds to milliseconds
  }

  /**
   * Get the current token, refreshing it if necessary
   */
  private async getToken(): Promise<string> {
    if (
      !this.clientToken ||
      (this.tokenExpiration && Date.now() >= this.tokenExpiration)
    ) {
      await this.authenticate();
    }
    return this.clientToken!;
  }

  /**
   * Get a secret from Vault
   * @param {GetSecretParams} params - Parameters for getting a secret
   * @returns {Promise<any>} - Secret data
   */
  async getSecret({ path }: GetSecretParams): Promise<any> {
    const token = await this.getToken();
    const response = await this.fetcher({
      method: methods.get,
      url: `/${this.rootPath}/data/${path}`,
      contentType: contentTypes.json,
      headers: {
        "X-Vault-Token": token,
      },
    });

    return response.data;
  }

  /**
   * Create or update a secret in Vault
   * @param {CreateSecretParams} params - Parameters for creating or updating a secret
   * @returns {Promise<any>} - Response data from the Vault server
   */
  async createSecret({ path, data }: CreateSecretParams): Promise<any> {
    const token = await this.getToken();
    const response = await this.fetcher({
      method: methods.post,
      url: `/${this.rootPath}/data/${path}`,
      contentType: contentTypes.json,
      headers: {
        "X-Vault-Token": token,
      },
      body: { data },
    });

    return response.data;
  }
}
