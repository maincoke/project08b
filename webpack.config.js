const path = require('path');

module.exports = {
    mode: "development",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'inicio'),
        filename: 'index.js'
    },
    devServer: {
        hot: true,
        inline: true,
        port: 3200,
        index: path.resolve(__dirname, 'inicio/index.html'),
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*'
        },
        historyApiFallback: true,
        host: '0.0.0.0',
        contentBase: path.join(__dirname, 'inicio'),
        watchContentBase: true
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        }]
    }
};