import * as React from "react";
import { WS_API_BASE } from "../../../env";

const styles = require("./styles/rateLimit.less");

interface RateLimitProps {}

interface RateLimitState {
    remain: number;
}

declare var WebSocket;

export default class RateLimit extends React.Component<RateLimitProps, RateLimitState> {
    constructor(props) {
        super(props);
        this.state = {
            remain: 0
        };
    }

    setupRateLimitWSConnection = () => {
        const ws = new WebSocket(WS_API_BASE);
        // const wsProtocol = window.location.protocol.indexOf("https") > -1 ? "wss" : "ws";
        // const ws = new WebSocket(wsProtocol + "://" + location.hostname + ":" + location.port + "/ratelimit");
        ws.onmessage = message => {
            this.setState({
                remain: Number(message.data.toString())
            });
            setTimeout(() => {
                ws.send("");
            }, 2000);
        };
    };

    componentDidMount() {
        this.setupRateLimitWSConnection();
    }

    render() {
        const { remain } = this.state;
        return (
            <div className={styles.wrapper}>
                {remain > 0 && <span>{remain} requests left before rate-limit</span>}
                {remain < 1 && (
                    <span>
                        The app is currently rate-limited<br />Please check back later
                    </span>
                )}
            </div>
        );
    }
}
