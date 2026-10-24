import type { Page } from '@playwright/test';
import type { LoginPage } from '../pages/LoginPage';
import type { SendWaPage } from '../pages/SendWaPage';

declare module '@playwright/test' {
  interface Fixtures {
    loginPage: LoginPage;
    sendWaPage: SendWaPage;
    appPages: {
      loginPage: LoginPage;
      sendWaPage: SendWaPage;
    };
  }
}
