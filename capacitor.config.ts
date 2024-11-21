import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lucasbortoli.prototipo_camera",
  appName: "Protótipo Câmera",
  webDir: "dist",
  // Usar essa configuração durante desenvolvimento + HMR
  // trocar o http pelo ip do pc
  //server: {
  //  url: "192.168.0.49:5173",
  //  cleartext: true,
  //},
};

export default config;
