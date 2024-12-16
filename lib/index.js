"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  HashiVault: () => HashiVault
});
module.exports = __toCommonJS(src_exports);

// src/hashi-vault.ts
var import_fetcher = require("fetcher");
var HashiVault = class {
  /**
   * @param {VaultClientConfig} config - Configuration object for HashiVault
   */
  constructor({
    baseURL,
    rootPath,
    appRole,
    roleId,
    secretId,
    logging = false
  }) {
    this.clientToken = null;
    this.tokenExpiration = null;
    this.fetcher = (0, import_fetcher.create_instance)({
      baseURL,
      logging
    });
    if (rootPath) {
      this.rootPath = rootPath;
    }
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
  healthCheck() {
    return __async(this, null, function* () {
      const response = yield this.fetcher({
        method: import_fetcher.methods.get,
        url: "/sys/health",
        contentType: import_fetcher.contentTypes.json
      });
      return response.data;
    });
  }
  /**
   * Authenticate with AppRole to get a new client token
   * @returns {Promise<void>}
   */
  authenticate() {
    return __async(this, null, function* () {
      const response = yield this.fetcher({
        method: import_fetcher.methods.post,
        url: `/auth/${this.appRole}/login`,
        contentType: import_fetcher.contentTypes.json,
        body: {
          role_id: this.roleId,
          secret_id: this.secretId
        }
      });
      const data = response.data;
      this.clientToken = data.auth.client_token;
      this.tokenExpiration = Date.now() + data.auth.lease_duration * 1e3;
    });
  }
  /**
   * Get the current token, refreshing it if necessary
   */
  getToken() {
    return __async(this, null, function* () {
      if (!this.clientToken || this.tokenExpiration && Date.now() >= this.tokenExpiration) {
        yield this.authenticate();
      }
      return this.clientToken;
    });
  }
  /**
   * Get a secret from Vault
   * @param {GetSecretParams} params - Parameters for getting a secret
   * @returns {Promise<any>} - Secret data
   */
  getSecret(_0) {
    return __async(this, arguments, function* ({ rootPath, path }) {
      const token = yield this.getToken();
      const response = yield this.fetcher({
        method: import_fetcher.methods.get,
        url: `/${rootPath || this.rootPath}/data/${path}`,
        contentType: import_fetcher.contentTypes.json,
        headers: {
          "X-Vault-Token": token
        }
      });
      return response.data;
    });
  }
  /**
   * Create or update a secret in Vault
   * @param {CreateSecretParams} params - Parameters for creating or updating a secret
   * @returns {Promise<any>} - Response data from the Vault server
   */
  createSecret(_0) {
    return __async(this, arguments, function* ({
      rootPath,
      path,
      data
    }) {
      const token = yield this.getToken();
      const response = yield this.fetcher({
        method: import_fetcher.methods.post,
        url: `/${rootPath || this.rootPath}/data/${path}`,
        contentType: import_fetcher.contentTypes.json,
        headers: {
          "X-Vault-Token": token
        },
        body: { data }
      });
      return response.data;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HashiVault
});
//# sourceMappingURL=index.js.map