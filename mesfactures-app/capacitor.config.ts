import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mesfactures.app',
  appName: 'MesFactures',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
