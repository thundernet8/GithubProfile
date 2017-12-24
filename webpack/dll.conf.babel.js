import path from "path";
import webpack from "webpack";
import { PUBLIC_ASSETS_URL } from "../env";
const AssetsPlugin = require("assets-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";
const getPlugins = function() {
    let plugins = [
        new webpack.DllPlugin({
            context: __dirname,
            path: "manifest.json",
            name: "[name]_[chunkhash:8]"
        }),
        new AssetsPlugin({
            filename: "venders-config.json",
            path: "./"
        }),
        new webpack.HashedModuleIdsPlugin()
    ];

    if (!isDev) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: true
            })
        );
    }
    return plugins;
};

const config = {
    entry: {
        venders: [
            "react",
            "react-dom",
            "react-router",
            "react-router-dom",
            "babel-polyfill",
            "mobx",
            "mobx-react",
            "axios",
            "classnames",
            "react-document-meta",
            "moment",
            "bluebird",
            "echarts/lib/echarts",
            "echarts/lib/chart/pie",
            "echarts/lib/chart/line",
            "echarts/lib/component/tooltip",
            "echarts/lib/component/title",
            "echarts/lib/component/dataZoom",
            "echarts/lib/component/grid",
            "echarts/lib/component/legendScroll"
        ]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets/js"),
        publicPath: isDev ? "/assets/js/" : `${PUBLIC_ASSETS_URL}js/`,
        filename: "[name].[chunkhash:8].js",
        library: "[name]_[chunkhash:8]"
    },
    resolve: {
        modules: ["node_modules", path.resolve(__dirname, "../src/shared")]
    },
    plugins: getPlugins()
};

if (isDev) {
    config.devtool = "#source-map"; // '#eval-source-map'
}

export default config;
