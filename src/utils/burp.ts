import fs from 'fs';
import path from 'path';

export function parseBurpSuiteFile(filePath: string) {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  const lines = content.split('\n');
  const headers: Record<string, string> = {};
  let method = 'GET';
  let url = '';
  let body = '';
  let isBody = false;

  for (const line of lines) {
    if (line.startsWith('GET') || line.startsWith('POST') || line.startsWith('PUT') || line.startsWith('DELETE')) {
      const parts = line.split(' ');
      method = parts[0];
      url = parts[1];
    } else if (line.trim() === '') {
      isBody = true;
    } else if (isBody) {
      body += line;
    } else {
      const [key, value] = line.split(': ');
      headers[key] = value;
    }
  }

  return { method, url, headers, body };
}