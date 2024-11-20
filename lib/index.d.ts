interface VaultClientConfig {
    baseURL: string;
    rootPath: string;
    appRole: string;
    roleId: string;
    secretId: string;
    logging?: boolean;
}

interface GetSecretParams {
    path: string;
    token?: string;
}

interface CreateSecretParams {
    path: string;
    data: Record<string, any>;
    token?: string;
}

declare class HashiVault {
    private fetcher;
    private rootPath;
    private appRole;
    private roleId;
    private secretId;
    private clientToken;
    private tokenExpiration;
    private logging;
    /**
     * @param {VaultClientConfig} config - Configuration object for HashiVault
     */
    constructor({ baseURL, rootPath, appRole, roleId, secretId, logging, }: VaultClientConfig);
    /**
     * Perform a health check on the Vault server
     * @returns {Promise<any>} - Response data from the health check
     */
    healthCheck(): Promise<any>;
    /**
     * Authenticate with AppRole to get a new client token
     * @returns {Promise<void>}
     */
    private authenticate;
    /**
     * Get the current token, refreshing it if necessary
     */
    private getToken;
    /**
     * Get a secret from Vault
     * @param {GetSecretParams} params - Parameters for getting a secret
     * @returns {Promise<any>} - Secret data
     */
    getSecret({ path }: GetSecretParams): Promise<any>;
    /**
     * Create or update a secret in Vault
     * @param {CreateSecretParams} params - Parameters for creating or updating a secret
     * @returns {Promise<any>} - Response data from the Vault server
     */
    createSecret({ path, data }: CreateSecretParams): Promise<any>;
}

export { type CreateSecretParams, type GetSecretParams, HashiVault, type VaultClientConfig };
