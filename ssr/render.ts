import * as path from "path";
import * as fs from "fs";
import { matchPath } from "react-router-dom";
import * as _Promise from "bluebird";
import * as ReactDOMServer from "react-dom/server";
import * as ejs from "ejs";
import { URL } from "url";
import * as send from "koa-send";
import { lowerCaseFirst } from "../src/shared/utils/TextKit";
import { IStoreArgument } from "../src/shared/interface/IStoreArgument";
import { API_BASE } from "../env";

const App = require("../dist/assets/js/server").default;
const routes = require("../dist/assets/js/server").Routes;
const DocumentMeta = require("../dist/assets/js/server").SSRDocumentMeta;

export default async (ctx, next) => {
    const urlObj: URL = ctx.URL;
    const location = {
        url: urlObj.protocol + "//" + urlObj.host + urlObj.pathname,
        hash: urlObj.hash,
        pathname: urlObj.pathname,
        search: urlObj.search
    };
    const promises: any[] = [];
    const stores: any = {};
    let match;
    const storeArg: IStoreArgument = {
        match: {} as any,
        location
    };
    // routes必须包含一个404通配路由
    routes.some(route => {
        // route isExact为true, originalUrl包含location.search信息将不能匹配, 用pathname替代
        match = matchPath(location.pathname, route);
        if (match) {
            storeArg.match = match;
            const storeClasses = route.component["STORE_CLASSES"];
            storeClasses.forEach(clazz => {
                if (clazz.name === "GlobalStore") {
                    clazz.API_BASE = API_BASE;
                }
            });
            storeClasses &&
                storeClasses.forEach((clazz: any) => {
                    if (clazz.instance) {
                        clazz.instance = null;
                    }
                    if (clazz.getInstance) {
                        const key = lowerCaseFirst(clazz.name);
                        stores[key] = clazz.getInstance(storeArg);
                    }
                });
        }
        return match;
    });
    Object.keys(stores).forEach((key: string) => {
        promises.push(stores[key].fetchData());
    });

    await _Promise.all(promises);

    try {
        const initialState = {};
        Object.keys(stores).forEach((key: string) => {
            initialState[key] = stores[key].toJSON();
        });
        const context: any = {};
        const markup = ReactDOMServer.renderToString(App(location, context, stores));
        const meta = DocumentMeta.renderAsHTML();

        if (context.url) {
            // Somewhere a `<Redirect>` was rendered
            ctx.redirect(context.url);
            return;
        }

        const html = ejs.render(
            fs.readFileSync(path.resolve(__dirname, "../dist/index.ejs")).toString(),
            {
                meta,
                markup,
                initialState: JSON.stringify(initialState)
            }
        );

        ctx.status = 200;
        ctx.body = html;
        return next();
    } catch (err) {
        console.log(err);
        send(ctx, "./dist/index.html");
    }
};
