# HashiVault Client Package

`HashiVault` is a simple client library for interacting with HashiCorp Vault. It provides methods for authentication and accessing secrets using AppRole login, as well as performing health checks on the Vault server.

This package allows you to:

- Authenticate to Vault using AppRole credentials.
- Retrieve and create secrets.
- Perform a health check on the Vault server.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Creating an Instance](#creating-an-instance)
  - [Health Check](#health-check)
  - [Getting a Secret](#getting-a-secret)
  - [Creating or Updating a Secret](#creating-or-updating-a-secret)
- [Configuration](#configuration)
- [License](#license)

## Installation

To install the `HashiVault` package, run the following command:

```bash
npm install github:shamikhbal/hashi-vault
```

## Usage

### Importing the Library

To use the `HashiVault` client, import the class from the package:

```typescript
import { HashiVault } from "hashi-vault";
```

### Creating an Instance

You need to create an instance of the `HashiVault` class by passing in the configuration. The configuration includes:

- `baseURL`: The base URL of your Vault server.
- `rootPath`: The root path for secrets storage.
- `appRole`: The authentication method to be used (AppRole).
- `roleId`: The AppRole `role_id`.
- `secretId`: The AppRole `secret_id`.
- `logging`: (Optional) A boolean flag to enable or disable logging. Default is `false`.

Example:

```typescript
const config = {
  baseURL: "https://vault.example.com",
  rootPath: "secret",
  appRole: "my-app-role",
  roleId: "my-role-id",
  secretId: "my-secret-id",
  logging: true, // Set to true to enable logging
};

const vaultClient = new HashiVault(config);
```

### Health Check

You can check the health of your Vault server using the `healthCheck()` method:

```typescript
async function checkHealth() {
  const vaultClient = new HashiVault(config);

  try {
    const healthStatus = await vaultClient.healthCheck();
    console.log("Vault Health:", healthStatus);
  } catch (error) {
    console.error("Health check failed:", error);
  }
}

checkHealth();
```

### Getting a Secret

To retrieve a secret from Vault, use the `getSecret()` method. You need to pass the secret path as a parameter.

```typescript
async function getSecret() {
  const vaultClient = new HashiVault(config);
  const secretPath = "my/secret/path"; // The path to the secret

  try {
    const secret = await vaultClient.getSecret({ path: secretPath });
    console.log("Retrieved Secret:", secret);
  } catch (error) {
    console.error("Failed to retrieve secret:", error);
  }
}

getSecret();
```

### Creating or Updating a Secret

You can create or update a secret in Vault using the `createSecret()` method. You will need to pass both the secret path and the secret data as parameters.

```typescript
async function createOrUpdateSecret() {
  const vaultClient = new HashiVault(config);
  const secretPath = "my/secret/path";
  const secretData = { key: "value" }; // The secret data

  try {
    const response = await vaultClient.createSecret({
      path: secretPath,
      data: secretData,
    });
    console.log("Secret Created/Updated:", response);
  } catch (error) {
    console.error("Failed to create/update secret:", error);
  }
}

createOrUpdateSecret();
```

## Configuration

### Options for `HashiVault` constructor:

- `baseURL`: The base URL of your Vault server (e.g., `https://vault.example.com`).
- `rootPath`: The root path in Vault where secrets are stored (e.g., `secret`).
- `appRole`: The authentication method to be used. Should be set to the `appRole` authentication method (`my-app-role`).
- `roleId`: The `role_id` for AppRole authentication.
- `secretId`: The `secret_id` for AppRole authentication.
- `logging`: (Optional) A boolean flag to enable or disable logging (default: `false`).

```typescript
const config = {
  baseURL: "https://vault.example.com",
  rootPath: "secret",
  appRole: "my-app-role",
  roleId: "my-role-id",
  secretId: "my-secret-id",
  logging: true, // Enable logging
};
```

### Methods:

- `healthCheck()`: Performs a health check on the Vault server and returns the health status.
- `getSecret({ path: string })`: Retrieves a secret from Vault by the provided path.
- `createSecret({ path: string, data: any })`: Creates or updates a secret in Vault at the specified path with the given data.

## License

This project is licensed under the MIT License.
