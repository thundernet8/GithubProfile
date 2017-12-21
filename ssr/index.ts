import * as path from "path";
import * as koa from "koa";
import * as koaStatic from "koa-static";
import * as bodyParser from "koa-bodyparser";
import ssrRouter from "./render";
import { SSR_SERVER_HOST, SSR_SERVER_PORT } from "../env";

let app = koa();
app.use(bodyParser());

// x-response-time
app.use(function*(next) {
    // (1) 进入路由
    var start = new Date().getTime();
    yield next;
    // (5) 再次进入 x-response-time 中间件，记录2次通过此中间件「穿越」的时间
    var ms = new Date().getTime() - start;
    this.set("X-Response-Time", ms + "ms");
    // (6) 返回 this.body
});

app.use(
    koaStatic(path.resolve(__dirname, "../dist"), {
        gzip: true,
        index: "",
        maxage: 31536000000 // milliseconds
    })
);

app.get(/^[^.]+$/, ssrRouter);

app.disable("x-powered-by");

app.listen(SSR_SERVER_PORT, SSR_SERVER_HOST, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`SSR Node Server Is Listening at http://${SSR_SERVER_HOST}:${SSR_SERVER_PORT}`);
});
