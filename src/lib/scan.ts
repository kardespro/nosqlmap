import axios from 'axios';
import randomUseragent from 'random-useragent';
import { generatePayloads } from '../extra/payloads';

interface ScanOptions {
  url: string;
  method: string;
  fieldName: string;
  isJson: boolean;
  cookies?: string;
  headers?: Record<string, string>;
  proxy?: string;
}

function getRandomUserAgent() {
  return randomUseragent.getRandom();
}

export async function scan(options: ScanOptions) {
  const { url, method, fieldName, isJson, cookies, headers, proxy } = options;
  const payloads = generatePayloads(fieldName, isJson);
  const userAgent = getRandomUserAgent();

  for (const { payload, description } of payloads) {
    try {
      const requestConfig: any = {
        method: method as any,
        url,
        headers: {
          'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
          'User-Agent': userAgent,
          ...headers,
          ...(cookies ? { 'Cookie': cookies } : {})
        },
        proxy: proxy ? {
          host: new URL(proxy).hostname,
          port: Number(new URL(proxy).port)
        } : undefined
      };

      if (method.toUpperCase() === 'GET') {
        requestConfig.params = JSON.parse(payload);
      } else {
        requestConfig.data = payload;
      }

      const response = await axios(requestConfig);
      console.log(`Payload: ${payload}\nDescription: ${description}\nResponse: ${response.status} - ${response.statusText}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
      } else {
        console.error(`Error: ${error}`);
      }
    }
  }
}