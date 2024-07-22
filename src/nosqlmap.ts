import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { scan } from './lib/scan';
import { parseBurpSuiteFile } from './utils/burp';

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
    default: 'POST',
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
  .option('auto_proxy', {
    type: 'boolean',
    description: 'Proxy requests automatic',
  })
  .option('burp', {
    type: 'string',
    description: 'Path to Burp Suite request file',
  })
  .help()
  .parseSync(); 

async function runScan() {
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
      proxy: argv.proxy
    });
  } else {
    scan({
      url: argv.url,
      method: argv.method,
      fieldName: argv.method === 'GET' ? undefined : (argv.field || ""),
      isJson: argv.json,
      headers: argv.header,
      cookies: argv.cookie,
      proxy: argv.proxy,
      autoProxy: argv.auto_proxy
    });
  }
}

runScan();
