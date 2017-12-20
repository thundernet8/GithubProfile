import * as path from "path";
import { matchPath } from "react-router-dom";
import * as Promise from "bluebird";
import * as ReactDOMServer from "react-dom/server";
import * as ejs from "ejs";
import { URL } from "url";
import { lowerCaseFirst } from "../src/shared/utils/TextKit";
import IStoreArgument from "../src/shared/interface/IStoreArgument";
const App = require("../dist/assets/js/server").default;
const routes = require("../dist/assets/js/server").Routes;
const DocumentMeta = require("../dist/assets/js/server").SSRDocumentMeta;

export default (req, res) => {
    const fullUrl = req.protocol + "://" + req.headers.host + req.originalUrl;
    const urlObj = new URL(fullUrl);
    const location = {
        url: fullUrl,
        hash: urlObj.hash,
        pathname: urlObj.pathname,
        search: urlObj.search
    };
    const promises: any[] = [];
    const stores: any = {};
    let match;
    const storeArg: IStoreArgument = {
        match: {} as any,
        location,
        cookies: req.headers.cookie
    };
    // routes必须包含一个404通配路由
    routes.some(route => {
        // route isExact为true, originalUrl包含location.search信息将不能匹配, 用pathname替代
        match = matchPath(location.pathname, route);
        if (match) {
            storeArg.match = match;
            const storeClasses = route.component["STORE_CLASSES"];
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

    Promise.all(promises)
        .then(() => {
            const initialState = {};
            Object.keys(stores).forEach((key: string) => {
                initialState[key] = stores[key].toJSON();
            });
            const context: any = {};
            const markup = ReactDOMServer.renderToString(App(location, context, stores));
            const meta = DocumentMeta.renderAsHTML();

            if (context.url) {
                // Somewhere a `<Redirect>` was rendered
                res.redirect(302, context.url);
                return;
            }

            ejs.renderFile(
                path.resolve(__dirname, "../dist/index.ejs"),
                {
                    meta,
                    markup,
                    initialState: JSON.stringify(initialState)
                },
                {},
                function(err, html) {
                    if (!err) {
                        res.send(html);
                    } else {
                        res.status(500).send(err.toString());
                    }
                }
            );
        })
        .catch(err => {
            console.log(err);
            res.sendFile(path.resolve(__dirname, "../dist/index.html"));
        });
};
