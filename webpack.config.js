const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fibers = require('fibers')
const sass = require('sass')

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const baseURL = process.env.BASE_URL ?? "/";

module.exports = {
    mode: isProduction ? "production" : "development",
    entry: {
        index: path.join(__dirname, "src", "index.js"),
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: baseURL,
        filename: "assets/scripts/[name].[contenthash:8].js",
        chunkFilename: "assets/scripts/chunk.[contenthash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude:/node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.(?:c|sa|sc)ss$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDevelopment,
                            importLoaders: 2,
                            modules: {
                                auto: true,
                                localIdentName: isProduction ? "[hash:base64:8]" : "[path][name]__[local]",
                                exportLocalsConvention: "dashesOnly",
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDevelopment,
                            implementation: sass,
                            sassOptions: {
                                fiber: fibers,
                            },
                        },
                    }
                ],
            },
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "head",
            minify: isProduction,
            template: "src/index.html",
            scriptLoading: "defer",
        })
    ]
};
