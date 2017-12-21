import * as React from "react";
import NotFoundView from "views/notFound";

interface NotFoundEntryProps {}

interface NotFoundEntryState {}

export default class NotFoundEntry extends React.Component<NotFoundEntryProps, NotFoundEntryState> {
    // SSR 在入口组件中获知Store类并初始化用于实例注入
    static STORE_CLASSES = [];

    render() {
        return <NotFoundView />;
    }
}
