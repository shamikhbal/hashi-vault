import { HashiVault } from "../src/hashi-vault";

const vaultClient = new HashiVault({
  baseURL: "",
  rootPath: "",
  appRole: "",
  roleId: "",
  secretId: "",
  logging: true,
});

describe("[HASHI VAULT] - Health Check", () => {
  it("Health Check", async () => {
    const status = await vaultClient.healthCheck();

    expect(status.initialized).toBe(true);
  });
});

describe("[HASHI VAULT] - Get Secret", () => {
  it("Get Secret", async () => {
    const secret = await vaultClient.getSecret({ path: "" });

    expect(typeof secret.data).toBe("object");
  });
});
