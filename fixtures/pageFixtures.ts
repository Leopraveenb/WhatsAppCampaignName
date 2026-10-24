import { test as base, expect as baseExpect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SendWaPage } from '../pages/SendWaPage';

export type AppPages = {
  loginPage: LoginPage;
  sendWaPage: SendWaPage;
};

export const test = base.extend<{
  loginPage: LoginPage;
  sendWaPage: SendWaPage;
  appPages: AppPages;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  sendWaPage: async ({ page }, use) => {
    await use(new SendWaPage(page));
  },

  appPages: async ({ page }, use) => {
    await use({
      loginPage: new LoginPage(page),
      sendWaPage: new SendWaPage(page),
    });
  },
});

export const expect = baseExpect;
