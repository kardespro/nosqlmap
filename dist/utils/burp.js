"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBurpSuiteFile = parseBurpSuiteFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseBurpSuiteFile(filePath) {
    const content = fs_1.default.readFileSync(path_1.default.resolve(filePath), 'utf8');
    const lines = content.split('\n');
    const headers = {};
    let method = 'GET';
    let url = '';
    let body = '';
    let isBody = false;
    for (const line of lines) {
        if (line.startsWith('GET') || line.startsWith('POST') || line.startsWith('PUT') || line.startsWith('DELETE')) {
            const parts = line.split(' ');
            method = parts[0];
            url = parts[1];
        }
        else if (line.trim() === '') {
            isBody = true;
        }
        else if (isBody) {
            body += line;
        }
        else {
            const [key, value] = line.split(': ');
            headers[key] = value;
        }
    }
    return { method, url, headers, body };
}
