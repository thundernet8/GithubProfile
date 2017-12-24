import * as React from "react";

const styles = require("./index.less");

interface CommonFooterProps {}

interface CommonFooterState {}

export default class CommonFooter extends React.Component<CommonFooterProps, CommonFooterState> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className={styles.footer}>
                GitHub profile is built with <a href="http://koajs.com/">Koa</a> and{" "}
                <a href="http://echarts.baidu.com/" target="_blank">
                    ECharts
                </a>{" "}
                <small>(visualization)</small>. Source is on{" "}
                <a href="https://github.com/thundernet8/GithubProfile" target="_blank">
                    GitHub
                </a>.
            </footer>
        );
    }
}
