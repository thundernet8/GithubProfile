import * as WebSocket from "ws";
import { WS_SERVER_HOST, WS_SERVER_PORT, IS_PROD } from "../env";
import ConsoleWrapper from "./util/ConsoleWrapper";
import GithubService from "./service/GithubService";

export default function startRateLimitWSServer() {
    const wss = new WebSocket.Server({
        host: WS_SERVER_HOST,
        port: WS_SERVER_PORT,
        path: "/ratelimit",
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

    if (!IS_PROD) {
        ConsoleWrapper.log(
            `Ratelimit WS Server Is Listening at ws://${WS_SERVER_HOST}:${WS_SERVER_PORT}/ratelimit`
        );
    }
}
