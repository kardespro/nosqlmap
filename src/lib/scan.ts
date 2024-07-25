import axios, { AxiosRequestConfig } from 'axios';
import randomUseragent from 'random-useragent'; 
import { blue, green, red, bold, cyan, underline } from "colorette";
import { generatePayloads } from '../extra/payloads';
import { generateAIPayloads } from '../utils/ai';
import { saveLog } from '../utils/log';
import { getProxies } from '../utils/auto-proxy';
import { detectWAF } from '../utils/waf';

interface ScanOptions {
  url: string;
  method: string;
  fieldName?: string;
  isJson: boolean;
  cookies?: string;
  headers?: Record<string, string>;
  proxy?: string;
  autoProxy?: boolean;
  useAI?: boolean;
  apiKey?: string;
}

function getRandomUserAgent() {
  return randomUseragent.getRandom();
}

async function getProxy() {
  const d = await getProxies();
  const rand = d[Math.floor(Math.random() * d.length)];
  return rand?.proxy;
}

export async function scan(options: ScanOptions) {
  const { url, method, fieldName, isJson, cookies, headers, proxy, autoProxy, useAI, apiKey } = options;
  const userAgent = getRandomUserAgent();
  console.log(`
     [${bold(underline(green("#")))}]   -  ${bold(blue("NoSqlMap"))}  -  ${bold(underline(green("Started")))}  
  `);

  let payloads;
  if(useAI && !apiKey) throw new Error("Invalid API key Provided")
  if (useAI && apiKey) {
    payloads = await generateAIPayloads(apiKey, fieldName || '', isJson, url);
  } else {
    payloads = generatePayloads(fieldName || '', isJson, method.toUpperCase() === 'GET');
  }

  await scanWithPayloads({ url, method, fieldName, isJson, cookies, headers, proxy, payloads, userAgent, autoProxy });
}

interface ScanWithPayloadsOptions extends ScanOptions {
  payloads: { payload: string, description: string }[];
  userAgent: string;
}

async function scanWithPayloads(options: ScanWithPayloadsOptions) {
  const { url, method, fieldName, isJson, cookies, headers, proxy, payloads, userAgent, autoProxy } = options;
  const isWafAvaliable = await detectWAF(url, headers);

  for (const { payload, description } of payloads) {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: method as string,
        url,
        headers: {
          'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
          'User-Agent': userAgent,
          ...headers,
          ...(cookies ? { 'Cookie': cookies } : {})
        },
        proxy: proxy ? {
          host: new URL(proxy).hostname,
          port: Number(new URL(proxy).port),
          protocol: new URL(proxy).protocol
        } : undefined
      };

      if (method.toUpperCase() === 'GET') {
        requestConfig.params = new URLSearchParams(payload);
      } else {
        requestConfig.data = payload;
      }

      const response = await axios(requestConfig);
      const hostname = new URL(url).hostname;
      const urlData = new URL(url);
      await saveLog({
        hostname: hostname,
        log_text: `
          ${hostname} - Log
            Payload: ${urlData.protocol}//${urlData.hostname}${urlData.pathname}${payload}
            Description: ${description}
            Response: ${response.status}
        `
      }).then((a) => console.log(a));
      console.log(` [${bold(green('#'))}]   ${bold(green('FOUND'))}
      
      ${bold(cyan('Payload'))}: ${payload} 
      ${bold(cyan('Description'))}: ${description}
      ${bold(cyan('Response'))}: ${response.status} ${underline(blue('-'))} ${response.statusText}
      
      `);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`${bold(red('Error'))}: ${error.response?.status} - ${error.response?.statusText}`);
      } else {
        console.error(`${bold(red('Error'))}: ${error}`);
      }
    }
  }
}
