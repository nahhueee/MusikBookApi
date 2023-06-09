"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
var pool = mysql_1.default.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: "",
    database: 'musikbookapp',
    multipleStatements: true
});
module.exports.pool = pool;
