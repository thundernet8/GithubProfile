import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";
// import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import * as responseTimer from "response-time";
import ssrRouter from "./render";
import { SSR_SERVER_HOST, SSR_SERVER_PORT } from "../env";

let app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(responseTimer());

app.use(
    express.static(path.resolve(__dirname, "../dist"), {
        index: "",
        maxAge: 31536000000, // milliseconds
        etag: false,
        lastModified: false
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
