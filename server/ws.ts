import * as WebSocket from "ws";
import { WS_SERVER_HOST, WS_SERVER_PORT, WS_RATELIMIT_PATH, IS_PROD, IS_DOCKER } from "../env";
import ConsoleWrapper from "./util/ConsoleWrapper";
import GithubService from "./service/GithubService";

export default function startRateLimitWSServer() {
    const wss = new WebSocket.Server({
        host: IS_DOCKER ? "0.0.0.0" : WS_SERVER_HOST,
        port: WS_SERVER_PORT,
        path: WS_RATELIMIT_PATH,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "",
            "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS"
        }
    });

    wss.on("connection", ws => {
        ws.on("message", message => {
            if (!IS_PROD) {
                ConsoleWrapper.log(message);
            }

            const ratelimit = GithubService.getInstance().rateLimit;
            try {
                ws.send(ratelimit ? ratelimit.remain : 0);
            } catch (err) {
                ConsoleWrapper.error(err);
            }
        });

        ws.on("error", err => {
            ConsoleWrapper.error(err);
        });

        try {
            ws.send(0);
        } catch (err) {
            ConsoleWrapper.error(err);
        }
    });

    wss.on("error", err => {
        ConsoleWrapper.error(err);
    });

    ConsoleWrapper.log(
        `Ratelimit WS Server Is Listening at ws://${
            IS_DOCKER ? "0.0.0.0" : WS_SERVER_HOST
        }:${WS_SERVER_PORT}${WS_RATELIMIT_PATH}`
    );
}
