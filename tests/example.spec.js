// @ts-check
import { test, expect } from '../fixtures/pageFixtures';
import { FileUtils } from '../utils/fileUtils';
import { EnvUtils } from '../utils/envUtils';

test('has title', async ({ appPages, page }) => {
  const { loginPage, sendWaPage } = appPages;
  const messageText = FileUtils.readText('testData/txt', 'sdetai_test_data.txt');
  const campaignRows = /** @type {{ companyName: string, phoneNumber: string }[]} */ (
    FileUtils.readCsv('testData/excel', 'campaign_data.csv')
  );
  const first10Numbers = campaignRows.slice(0, 50).map((row) => row.phoneNumber);
  const username = EnvUtils.get('APP_USERNAME');
  const password = EnvUtils.get('APP_PASSWORD');
  const appUrl = EnvUtils.get('APP_URL');

  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await loginPage.login(username, password);
  await sendWaPage.openSendWaMenu();
  await sendWaPage.sendCampaign('SDETAI Technologies', first10Numbers, messageText);
  await page.pause();
});
