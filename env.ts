export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_NODE =
    typeof global !== "undefined" && new Object().toString.call(global) === "[object global]";
export const PUBLIC_ASSETS_URL = IS_PROD ? "https://assets.webapproach.net/gh/assets/" : "/assets/";
// SSR Server
export const SSR_SERVER_HOST = IS_PROD ? "127.0.0.1" : "127.0.0.1";
export const SSR_SERVER_PORT = IS_PROD ? 9002 : 9002;

// API Server
export const API_SERVER_HOST = IS_PROD ? "127.0.0.1" : "127.0.0.1";
export const API_SERVER_PORT = IS_PROD ? 9000 : 9000;
export const API_BASE =
    IS_PROD && !IS_NODE
        ? "https://example.com/api/v1/"
        : `http://${API_SERVER_HOST}:${API_SERVER_PORT}/api/v1/`;

// Github Token
export const GITHUB_TOKEN = "";
