import * as path from "path";
import * as koa from "koa";
import * as koaStatic from "koa-static";
import * as bodyParser from "koa-bodyparser";
import * as route from "koa-route";
import * as moment from "moment";
import ssrRouter from "./render";
import { SSR_SERVER_HOST, SSR_SERVER_PORT, IS_DOCKER } from "../env";

let app = new koa();
app.use(bodyParser({}));

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(
    route.get("/assets/(.*)/", koaStatic(path.resolve(__dirname, "../dist"), {
        gzip: true,
        index: "",
        maxage: 31536000000 // milliseconds
    }) as any)
);

app.use(ssrRouter as any);

app.listen(SSR_SERVER_PORT, IS_DOCKER ? "0.0.0.0" : SSR_SERVER_HOST, () => {
    console.log(
        `SSR Node Server Is Listening at http://${
            IS_DOCKER ? "0.0.0.0" : SSR_SERVER_HOST
        }:${SSR_SERVER_PORT}`
    );
});

app.on("error", err => {
    console.error(`[${moment().format("YYYY-MM-DD HH:mm:ss")}]: ${err.message || err.toString()}`);
});
