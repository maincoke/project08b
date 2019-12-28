/**
 * Configuracion de Servidor WEB con WebPack ** //
 */
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: [ "react-hot-loader/patch", "./src/main.js" ],
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "index.js",
        publicPath: "/dist/"
    },
    resolve: { extensions: ["*", ".js", ".jsx "] },
    devServer: {
        hotOnly: true,
        stats: "errors-only",
        inline: true,
        port: 3200,
        index: path.resolve(__dirname, "public/index.html"),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        },
        host: "0.0.0.0",
        publicPath: "/dist",
        contentBase: path.join(__dirname, "public/"),
        watchContentBase: true,
        historyApiFallback: { index: "/dist/index.html" },
    },
    module: {
        rules: [
            {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
                }
            },
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
                
            },
            {
                test: /\.(png|jpe?g)$/i,
                use: [{
                loader: "url-loader",
                options: { limit: 10240, mimeType: [ "image/png", "image/jpg" ] } } ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [ "**/*", "!*.jpg", "!*.png", "!index.*" ] }),
        new HtmlWebPlugin({ template: "./public/index.html" }),
        new webpack.HotModuleReplacementPlugin() ]
};