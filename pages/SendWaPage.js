export class SendWaPage {
  constructor(page) {
    this.page = page;
    this.sendWaLink = page.getByRole('link', { name: 'Send WA' });
    this.sendWappLink = page.getByRole('link', { name: 'Send WAPP' });
    this.campaignNameInput = page.locator('#campname');
    this.toNumberInput = page.locator('#tonumber');
    this.submitButton = page.getByRole('button', { name: 'Submit Now' });
    this.confirmButton = page.getByRole('button', { name: 'Yes,Submit it!' });
    this.okButton = page.getByRole('button', { name: /^OK$/ });
  }

  async openSendWaMenu() {
    await this.page.goto('http://46.4.81.215/wap/sendwa.jsp', { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }

  async fillMessage(message) {
    const textMessageLocator = this.page.getByRole('textbox', { name: 'text message' });
    await textMessageLocator.waitFor({ state: 'visible', timeout: 15000 });
    await textMessageLocator.scrollIntoViewIfNeeded();
    await textMessageLocator.fill(message);
  }

  async waitAndClick(locator, timeout = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();
    await locator.click({ timeout });
  }

  async sendCampaign(campaignName, toNumber, message) {
    const phoneNumbers = Array.isArray(toNumber) ? toNumber : [toNumber];

    await this.campaignNameInput.fill(campaignName);
    await this.fillMessage(message);

    if (phoneNumbers.length > 0) {
      await this.toNumberInput.type(phoneNumbers[0]);
      for (const phone of phoneNumbers.slice(1)) {
        await this.toNumberInput.press('Enter');
        await this.toNumberInput.type(phone);
      }
    }

    await this.waitAndClick(this.submitButton);
    await this.waitAndClick(this.confirmButton);

    const limitMessage = this.page.getByText(/You Can Do Max 9 campaign only in single Day/i);
    if (await limitMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.waitAndClick(this.okButton, 5000);
      throw new Error('Campaign limit reached: the app allows a maximum of 9 campaigns in a single day.');
    }

    if (await this.okButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.waitAndClick(this.okButton, 5000);
    }
  }
}
