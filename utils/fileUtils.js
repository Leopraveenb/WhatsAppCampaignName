import fs from 'node:fs';
import path from 'node:path';

/**
 * @typedef {{ [key: string]: string }} CsvRecord
 */

export class FileUtils {
  static getDataRoot() {
    return path.join(process.cwd(), 'data');
  }

  static ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static resolveFile(category, fileName) {
    const base = this.getDataRoot();
    return path.join(base, category, fileName);
  }

  static fileExists(category, fileName) {
    const filePath = this.resolveFile(category, fileName);
    return fs.existsSync(filePath);
  }

  static readText(category, fileName) {
    const filePath = this.resolveFile(category, fileName);
    this.ensureDir(path.dirname(filePath));
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  static writeText(category, fileName, content) {
    const filePath = this.resolveFile(category, fileName);
    this.ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf8');
    return filePath;
  }

  static readJson(category, fileName) {
    const content = this.readText(category, fileName);
    return JSON.parse(content);
  }

  static writeJson(category, fileName, data) {
    const serialized = JSON.stringify(data, null, 2);
    this.writeText(category, fileName, serialized);
  }

  /**
   * @returns {CsvRecord[]}
   */
  static readCsv(category, fileName) {
    const content = this.readText(category, fileName).trim();
    if (!content) {
      return [];
    }

    const lines = content.split(/\r?\n/);
    const headers = lines[0].split(',').map((h) => h.trim());

    return lines.slice(1).filter(Boolean).map((line) => {
      const values = line.split(',').map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        const rawValue = values[index] ?? '';
        obj[header] = rawValue.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
        return obj;
      }, {});
    });
  }

  static readExcel(category, fileName) {
    const filePath = this.resolveFile(category, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found: ${filePath}`);
    }
    return filePath;
  }

  static writeExcel(category, fileName, data) {
    const filePath = this.resolveFile(category, fileName);
    this.ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, data);
    return filePath;
  }
}
