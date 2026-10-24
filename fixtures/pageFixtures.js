import { test as base, expect as baseExpect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { SendWaPage } from '../pages/SendWaPage.js';

/**
 * @typedef {Object} AppPages
 * @property {LoginPage} loginPage
 * @property {SendWaPage} sendWaPage
 */

/**
 * @type {typeof import('@playwright/test').test}
 */
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  sendWaPage: async ({ page }, use) => {
    await use(new SendWaPage(page));
  },

  appPages: async ({ page }, use) => {
    const pages = {
      loginPage: new LoginPage(page),
      sendWaPage: new SendWaPage(page),
    };
    await use(pages);
  },
});

export const expect = baseExpect;
