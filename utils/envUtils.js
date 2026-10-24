import fs from 'node:fs';
import path from 'node:path';

export class EnvUtils {
  static getEnvFilePath() {
    return path.join(process.cwd(), 'data', 'testData', '.env');
  }

  static loadFromFile() {
    const envFile = this.getEnvFilePath();
    if (!fs.existsSync(envFile)) {
      return;
    }

    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const [key, ...rest] = trimmed.split('=');
      const value = rest.join('=').trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }

  static get(name) {
    this.loadFromFile();
    const value = process.env[name];

    if (!value) {
      throw new Error(`Missing environment variable: ${name}. Add it in data/testData/.env`);
    }

    return value;
  }
}
