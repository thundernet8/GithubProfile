import * as React from "react";
import * as ReactDOM from "react-dom";
import { StaticRouter, BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "mobx-react";
// import PageLoader from "common/pageLoader";
import * as DocumentMeta from "react-document-meta";
import routes from "./routes";
import { IS_NODE } from "../env";

require("common/polyfill");

require("STYLES/global/index.less");
// require("STYLES/app.less");

export const Routes = routes;
export const SSRDocumentMeta = DocumentMeta;

// SSR APP entry
export default function Server(location, context, stores) {
    return (
        <Provider stores={stores}>
            <StaticRouter location={location} context={context}>
                <Switch>
                    {routes.map(
                        (route: any, index) =>
                            route.redirect ? (
                                <Route key={index} exact={!!route.exact} path={route.path}>
                                    <Redirect key={index} from={route.path} to={route.redirect} />
                                </Route>
                            ) : (
                                <Route
                                    key={index}
                                    exact={!!route.exact}
                                    path={route.path}
                                    component={route.component}
                                />
                            )
                    )}
                </Switch>
            </StaticRouter>
        </Provider>
    );
}

// Browser App entry
class App extends React.Component {
    render() {
        return (
            <Provider stores={{}}>
                <BrowserRouter location={location}>
                    <Switch>
                        {routes.map(
                            (route: any, index) =>
                                route.redirect ? (
                                    <Route key={index} exact={!!route.exact} path={route.path}>
                                        <Redirect
                                            key={index}
                                            from={route.path}
                                            to={route.redirect}
                                        />
                                    </Route>
                                ) : (
                                    <Route
                                        key={index}
                                        exact={!!route.exact}
                                        path={route.path}
                                        component={route.component}
                                    />
                                )
                        )}
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }
}

if (!IS_NODE) {
    ReactDOM.render(<App />, document.getElementById("app"));
}
