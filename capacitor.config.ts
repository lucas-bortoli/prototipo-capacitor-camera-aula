import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lucasbortoli.strata",
  appName: "strata-app",
  webDir: "dist",
  // Usar essa configuração durante desenvolvimento + HMR
  server: {
    url: "http://senai-arch:5173",
    cleartext: true,
  },
};

export default config;
