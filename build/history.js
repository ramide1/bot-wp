"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadHistory = exports.saveHistory = void 0;
var yaml_1 = require("yaml");
var fs_1 = require("fs");
var saveHistory = function (username, historyFile, message, response) {
    var history = {};
    if ((0, fs_1.existsSync)(historyFile)) {
        var fileContent = (0, fs_1.readFileSync)(historyFile, 'utf8');
        history = (0, yaml_1.parse)(fileContent) || {};
    }
    history[username] = history[username] || [];
    history[username].push({ message: message, response: response });
    var newYamlContent = (0, yaml_1.stringify)(history);
    (0, fs_1.writeFileSync)(historyFile, newYamlContent, 'utf8');
    return;
};
exports.saveHistory = saveHistory;
var loadHistory = function (username, historyFile) {
    if ((0, fs_1.existsSync)(historyFile)) {
        var fileContent = (0, fs_1.readFileSync)(historyFile, 'utf8');
        var history_1 = (0, yaml_1.parse)(fileContent) || {};
        return history_1[username] || [];
    }
    return [];
};
exports.loadHistory = loadHistory;
