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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGpt = void 0;
var history_1 = require("./history");
var callGpt = function (options, message, username) { return __awaiter(void 0, void 0, void 0, function () {
    var userHistory, messages, responseText, response, data, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userHistory = (0, history_1.loadHistory)(username, options.historyFile);
                messages = [
                    { role: options.googleApi ? 'user' : 'system', content: options.instructions }
                ];
                userHistory.forEach(function (entry) {
                    messages.push({ role: 'user', content: entry.message });
                    messages.push({ role: options.googleApi ? 'model' : 'assistant', content: entry.response });
                });
                messages.push({ role: 'user', content: message });
                responseText = '';
                if (!options.googleApi) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch('https://generativelanguage.googleapis.com/v1beta/models/' + options.model + ':generateContent?key=' + options.apiKey, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            contents: messages.map(function (msg) { return ({
                                role: msg.role,
                                parts: [
                                    {
                                        text: msg.content
                                    }
                                ]
                            }); })
                        })
                    })];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    return [2 /*return*/, { error: true, message: 'API request failed' }];
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                responseText = data.candidates[0].content.parts[0].text || '';
                return [3 /*break*/, 6];
            case 3: return [4 /*yield*/, fetch(options.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + options.apiKey
                    },
                    body: JSON.stringify({
                        model: options.model,
                        messages: messages
                    })
                })];
            case 4:
                response = _a.sent();
                if (!response.ok) {
                    return [2 /*return*/, { error: true, message: 'API request failed' }];
                }
                return [4 /*yield*/, response.json()];
            case 5:
                data = _a.sent();
                responseText = data.choices[0].message.content || '';
                _a.label = 6;
            case 6:
                if (responseText !== '') {
                    (0, history_1.saveHistory)(username, options.historyFile, message, responseText);
                    return [2 /*return*/, { error: false, message: responseText }];
                }
                return [2 /*return*/, { error: true, message: 'API request failed' }];
        }
    });
}); };
exports.callGpt = callGpt;
