const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: './src/js/main.js', 
    plugins: [
        new Dotenv({
            path: './src/process.env'
        }
            
        )
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '/dist'
    },
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};