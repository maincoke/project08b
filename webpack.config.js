const path = require('path');

module.exports = {
    entry: {
        path: path.resolve(__dirname, 'src'),
        filename: 'main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        file: 'index.js'
    },
    devServer: {
        hot: true,
        inline: true,
        port: 8081
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: ['@babel/preset-env', '@babel/preset-react']
            }
        }]
    }
};