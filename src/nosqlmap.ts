import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { scan } from './lib/scan';
import { parseBurpSuiteFile } from './utils/burp';
import { parseConfig, ConfigOptions } from './extra/ConfigManager';

const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    description: 'The URL to scan',
    demandOption: true,
  })
  .option('method', {
    alias: 'm',
    type: 'string',
    description: 'HTTP method to use (GET, POST, PUT, DELETE, etc.)',
    default: 'GET',
  })
  .option('field', {
    alias: 'f',
    type: 'string',
    description: 'The form field name to test for NoSQL injection',
    demandOption: false,
  })
  .option('json', {
    type: 'boolean',
    description: 'Indicates if the payload should be sent as JSON',
    default: true,
  })
  .option('cookie', {
    type: 'string',
    description: 'Cookies to include in the request',
  })
  .option('header', {
    type: 'array',
    description: 'Headers to include in the request (key:value)',
    coerce: (arg: any) => {
      if (!arg) return undefined;
      const headers: Record<string, string> = {};
      arg.forEach((header: string) => {
        const [key, value] = header.split(':');
        headers[key.trim()] = value.trim();
      });
      return headers;
    }
  })
  .option('proxy', {
    type: 'string',
    description: 'Proxy server to use (format: http://host:port)',
  })
  .option('burp', {
    type: 'string',
    description: 'Path to Burp Suite request file',
  })
  .option('tor', {
    type: 'boolean',
    description: 'Use Tor network',
    default: false,
  })
  .option('ai', {
    type: 'boolean',
    description: 'Use AI for payload generation',
    default: false,
  })
  .option('config', {
    type: 'string',
    description: 'Configuration string in the format GEMINI_API_KEY=value',
  })
  .help()
  .parseSync();

async function runScan() {
  let configOptions: ConfigOptions = {};

  if (argv.config) {
    configOptions = parseConfig(argv.config);
  }

  if (argv.burp) {
    const { method, url, headers, body } = parseBurpSuiteFile(argv.burp);
    const fieldName = argv.field || 'username';
    scan({
      url,
      method,
      fieldName,
      isJson: argv.json,
      headers,
      cookies: argv.cookie,
      proxy: argv.proxy,
      useAI: argv.ai,
      apiKey: configOptions.geminiApiKey,
    });
  } else {
    scan({
      url: argv.url,
      method: argv.method,
      fieldName: argv.field || "",
      isJson: argv.json,
      headers: argv.header,
      cookies: argv.cookie,
      proxy: argv.proxy,
      useAI: argv.ai,
      apiKey: configOptions.geminiApiKey,
    });
  }
}

runScan();