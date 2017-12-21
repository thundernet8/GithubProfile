"use strict";
exports.__esModule = true;
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.IS_NODE =
    typeof global !== "undefined" && new Object().toString.call(global) === "[object global]";
exports.API_BASE =
    exports.IS_PROD && !exports.IS_NODE
        ? "https://example.com/api/v1/"
        : "http://127.0.0.1:9000/api/v1/";
exports.PUBLIC_ASSETS_URL = exports.IS_PROD
    ? "https://assets.webapproach.net/gh/assets/"
    : "/assets/";
// SSR Server
exports.SSR_SERVER_HOST = exports.IS_PROD ? "127.0.0.1" : "127.0.0.1";
exports.SSR_SERVER_PORT = exports.IS_PROD ? 9002 : 9002;
