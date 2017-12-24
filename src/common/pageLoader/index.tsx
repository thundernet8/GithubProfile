import * as React from "react";
import ClassNames from "classnames";

const styles = require("./index.less");

interface PageLoaderProps {
    text?: string;
}

interface PageLoaderState {}

export default class PageLoader extends React.Component<PageLoaderProps, PageLoaderState> {
    constructor(props) {
        super(props);
    }

    render() {
        const { text } = this.props;
        return (
            <div className={styles.wrapper}>
                <div className={styles.spinner}>
                    <div className={ClassNames([styles.bounce], [styles.bounce1])} />
                    <div className={ClassNames([styles.bounce], [styles.bounce2])} />
                </div>
                {text && <p>{text}</p>}
            </div>
        );
    }
}
