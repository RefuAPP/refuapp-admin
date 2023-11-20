import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.refuapp.admin',
  appName: 'RefuApp Admin',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
