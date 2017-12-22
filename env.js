"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.IS_NODE =
    typeof global !== "undefined" && new Object().toString.call(global) === "[object global]";
exports.PUBLIC_ASSETS_URL = exports.IS_PROD
    ? "https://assets.webapproach.net/gh/assets/"
    : "/assets/";
// SSR Server
exports.SSR_SERVER_HOST = exports.IS_PROD ? "127.0.0.1" : "127.0.0.1";
exports.SSR_SERVER_PORT = exports.IS_PROD ? 9002 : 9002;
// API Server
exports.API_SERVER_HOST = exports.IS_PROD ? "127.0.0.1" : "127.0.0.1";
exports.API_SERVER_PORT = exports.IS_PROD ? 9000 : 9000;
exports.API_BASE =
    exports.IS_PROD && !exports.IS_NODE
        ? "https://example.com/api/v1/"
        : "http://" + exports.API_SERVER_HOST + ":" + exports.API_SERVER_PORT + "/api/v1/";
// Github Token
exports.GITHUB_TOKEN = "";
// Redis credentials
exports.REDIS_HOST = "127.0.0.1";
exports.REDIS_PORT = 6379;
exports.REDIS_PASSWORD = "";
