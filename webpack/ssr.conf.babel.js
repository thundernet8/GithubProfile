import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import SimpleProgressWebpackPlugin from "customized-progress-webpack-plugin";

const vendersConfig = require("../venders-config.json");

const plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new SimpleProgressWebpackPlugin({ format: "compact" }),
    new ExtractTextPlugin({
        filename: "css/app.[contenthash:8].css",
        disable: false,
        allChunks: true
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"), // eslint-disable-line global-require
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    })
];

const loaders = [
    {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
    },
    {
        test: /\.tsx?$/,
        loader: "babel-loader!ts-loader",
        exclude: /node_modules/
    },
    {
        test: /\.json$/,
        loader: "json-loader",
        exclude: /node_modules/
    },
    {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        loader: "url-loader",
        query: {
            limit: 2000,
            name: "img/[name].[ext]" // 'assets/img/[name].[ext]?[hash:7]'
        }
    },
    {
        test: /\.(woff|woff2|eot|ttf|svg)/, // if /\.(woff|woff2|eot|ttf|svg)$/ the font-awesome with url like xx.woff?v=4.7.0 can not be loaded
        exclude: /node_modules/,
        loader: "url-loader",
        query: {
            limit: 10000,
            name: "fonts/[name].[ext]"
        }
    },
    {
        test: /\.css$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?sourceMap!postcss-loader"
        })
    },
    {
        test: /\.css$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:
                "css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader"
        })
    },
    {
        test: /\.less$/,
        include: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader?sourceMap!postcss-loader!less-loader"
        })
    },
    {
        test: /\.less$/,
        exclude: [/global/, /node_modules/],
        loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use:
                "css-loader?modules&sourceMap&importLoaders=1&localIdentName=__[hash:base64:5]!postcss-loader!less-loader"
        })
    }
];

let config = {
    node: {
        __filename: false,
        __dirname: false
    },
    entry: {
        server: [path.resolve(__dirname, "../src/app.tsx")]
    },
    output: {
        path: path.resolve(__dirname, "../dist/assets"),
        publicPath: "/assets/",
        filename: "js/[name].js",
        chunkFilename: "js/[name].chunk.js",
        libraryTarget: "commonjs2",
        library: "ssr"
    },
    resolve: {
        extensions: [".json", ".js", ".jsx", ".ts", ".tsx", ".css", ".less"],
        alias: {
            IMG: path.resolve(__dirname, "../src/assets/images/"),
            STYLES: path.resolve(__dirname, "../src/assets/styles"),
            FONTS: path.resolve(__dirname, "../src/assets/fonts")
        },
        modules: ["node_modules", path.resolve(__dirname, "../src")]
    },
    target: "node",
    module: {
        rules: loaders
    },
    plugins
};

export default config;
