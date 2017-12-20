import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { Provider } from "mobx-react";
import PageLoader from "common/pageLoader";
import routes from "./routes";
require("polyfill");

require("STYLES/global/index.less");
require("STYLES/global/element/index.css");
require("STYLES/app.less");

interface LazyComponentWrapperProps {
    history: any;
    location: any;
    match: any;
    component: any;
    getComponent: (component: any) => void;
}

interface LazyComponentWrapperState {
    LazyComponent: any;
}

class LazyComponentWrapper extends React.Component<
    LazyComponentWrapperProps,
    LazyComponentWrapperState
> {
    constructor(props) {
        super(props);
        this.state = {
            LazyComponent: null
        };
    }

    componentDidMount() {
        const { getComponent } = this.props;
        if (!getComponent || typeof getComponent !== "function") {
            return;
        }

        this.props.getComponent(LazyComponent => {
            this.setState({
                LazyComponent
            });
        });
    }

    render() {
        const { component } = this.props;
        const { LazyComponent } = this.state;
        if (!component && !LazyComponent) {
            return <PageLoader />;
        }
        return React.createElement(component || LazyComponent, this.props);
    }
}

export default async function Client() {
    const { pathname } = window.location;
    let match;
    let matchRoute;
    routes.some(route => {
        match = matchPath(pathname, route);
        if (match) {
            matchRoute = route;
        }
        return match;
    });

    let syncComponent;
    if (match && matchRoute) {
        syncComponent = await new Promise((resolve, reject) => {
            try {
                matchRoute.getComponent(component => resolve(component));
            } catch (err) {
                reject(err);
            }
        });
    }

    return (
        <Provider stores={{}}>
            <Router location={location} context={context}>
                <Switch>
                    {routes.map((route, index) => (
                        <Route
                            key={index}
                            exact={!!route.exact}
                            path={route.path}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </Router>
        </Provider>
    );
}

App().then(root => {
    ReactDOM.hydrate(root as React.ReactElement<any>, document.getElementById("app"));
});
