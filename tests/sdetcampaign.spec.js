// @ts-check
import { test, expect } from '../fixtures/pageFixtures';
import { FileUtils } from '../utils/fileUtils';
import { EnvUtils } from '../utils/envUtils';

const CAMPAIGN_ROW_LIMIT = 25000;
const CAMPAIGN_BATCH_SIZE = 1000;
const CAMPAIGN_PROGRESS_FILE = '.campaign-progress.json';
const REQUIRED_DAILY_NUMBER = '7305180842';

test('SDETAI WhatsApp campaign run', async ({ appPages, page }) => {
  test.setTimeout(5 * 60 * 1000);

  const { loginPage, sendWaPage } = appPages;
  const messageText = FileUtils.readText('testData/txt', 'sdetai_test_data.txt');
  const campaignRows = /** @type {{ companyName: string, phoneNumber: string }[]} */ (
    FileUtils.readCsv('testData/excel', 'campaign_data.csv')
  );
  if (campaignRows.length < CAMPAIGN_ROW_LIMIT) {
    throw new Error(`Campaign data must contain at least ${CAMPAIGN_ROW_LIMIT} rows.`);
  }

  const savedProgress = FileUtils.fileExists('testData/excel', CAMPAIGN_PROGRESS_FILE)
    ? FileUtils.readJson('testData/excel', CAMPAIGN_PROGRESS_FILE)
    : { nextRow: 1 };
  if (
    !Number.isInteger(savedProgress.nextRow) ||
    savedProgress.nextRow < 1 ||
    savedProgress.nextRow > CAMPAIGN_ROW_LIMIT
  ) {
    throw new Error(`Invalid campaign progress in ${CAMPAIGN_PROGRESS_FILE}.`);
  }

  const startRow = savedProgress.nextRow;
  const firstRowIndex = startRow - 1;
  const batchNumbers = campaignRows
    .slice(firstRowIndex, firstRowIndex + CAMPAIGN_BATCH_SIZE)
    .map((row) => row.phoneNumber);
  expect(batchNumbers).toHaveLength(CAMPAIGN_BATCH_SIZE);
  const campaignNumbers = [...new Set([REQUIRED_DAILY_NUMBER, ...batchNumbers])];
  const nextRow = startRow + CAMPAIGN_BATCH_SIZE;
  FileUtils.writeJson('testData/excel', CAMPAIGN_PROGRESS_FILE, {
    nextRow: nextRow > CAMPAIGN_ROW_LIMIT ? 1 : nextRow,
  });

  const username = EnvUtils.get('APP_USERNAME');
  const password = EnvUtils.get('APP_PASSWORD');
  const appUrl = EnvUtils.get('APP_URL');

  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
  await loginPage.login(username, password);
  await sendWaPage.openSendWaMenu();
  await sendWaPage.sendCampaign('SDETAI Technologies', campaignNumbers, messageText);
});
