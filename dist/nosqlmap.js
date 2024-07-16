"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const scan_1 = require("./lib/scan");
const burp_1 = require("./utils/burp");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
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
    coerce: (arg) => {
        if (!arg)
            return undefined;
        const headers = {};
        arg.forEach((header) => {
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
    .help()
    .parseSync();
function runScan() {
    return __awaiter(this, void 0, void 0, function* () {
        if (argv.burp) {
            const { method, url, headers, body } = (0, burp_1.parseBurpSuiteFile)(argv.burp);
            const fieldName = argv.field || 'username';
            (0, scan_1.scan)({
                url,
                method,
                fieldName,
                isJson: argv.json,
                headers,
                cookies: argv.cookie,
                proxy: argv.proxy
            });
        }
        else {
            (0, scan_1.scan)({
                url: argv.url,
                method: argv.method,
                fieldName: argv.field || "",
                isJson: argv.json,
                headers: argv.header,
                cookies: argv.cookie,
                proxy: argv.proxy
            });
        }
    });
}
runScan();
