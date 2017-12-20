export const IS_PROD = process.env.NODE_ENV === "production";

export const IS_NODE =
    typeof global !== "undefined" && new Object().toString.call(global) === "[object global]";
export const API_BASE =
    IS_PROD && !IS_NODE ? "https://example.com/api/v1/" : "http://127.0.0.1:9000/api/v1/";

// SSR Server
export const SSR_SERVER_HOST = IS_PROD ? "127.0.0.1" : "127.0.0.1";
export const SSR_SERVER_PORT = IS_PROD ? 9002 : 9002;
