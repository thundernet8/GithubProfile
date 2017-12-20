import * as React from "react";
import NotFoundView from "views/notFound";

interface NotFoundProps {}

interface NotFoundState {}

export default class NotFound extends React.Component<NotFoundProps, NotFoundState> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [];

    render() {
        return <NotFoundView />;
    }
}
