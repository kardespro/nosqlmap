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
exports.scan = scan;
const axios_1 = __importDefault(require("axios"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const payloads_1 = require("../extra/payloads");
function getRandomUserAgent() {
    return random_useragent_1.default.getRandom();
}
function scan(options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { url, method, fieldName, isJson, cookies, headers, proxy } = options;
        const payloads = (0, payloads_1.generatePayloads)(fieldName, isJson);
        const userAgent = getRandomUserAgent();
        for (const { payload, description } of payloads) {
            try {
                const requestConfig = {
                    method: method,
                    url,
                    headers: Object.assign(Object.assign({ 'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded', 'User-Agent': userAgent }, headers), (cookies ? { 'Cookie': cookies } : {})),
                    proxy: proxy ? {
                        host: new URL(proxy).hostname,
                        port: Number(new URL(proxy).port)
                    } : undefined
                };
                if (method.toUpperCase() === 'GET') {
                    requestConfig.params = JSON.parse(payload);
                }
                else {
                    requestConfig.data = payload;
                }
                const response = yield (0, axios_1.default)(requestConfig);
                console.log(`Payload: ${payload}\nDescription: ${description}\nResponse: ${response.status} - ${response.statusText}`);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    console.error(`Error: ${(_a = error.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = error.response) === null || _b === void 0 ? void 0 : _b.statusText}`);
                }
                else {
                    console.error(`Error: ${error}`);
                }
            }
        }
    });
}
