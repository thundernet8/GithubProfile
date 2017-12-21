import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

interface PageLoaderProps {}

interface PageLoaderState {}

export default class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <div className={styles.spinner}>
                    <div className={ClassNames([styles.bounce], [styles.bounce1])} />
                    <div className={ClassNames([styles.bounce], [styles.bounce2])} />
                </div>
            </div>
        );
    }
}
