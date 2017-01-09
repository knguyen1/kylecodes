'use strict';

var webpack = require('webpack');

module.exports = {
    entry: './src/randomair/randomair.jsx',
    output: {
        path: __dirname,
        filename: './public/js/randomair.js'
    },
    // context: __dirname,
    // resolve: {
    //     extensions: ['','.js','.jsx']
    // },
    module: {
        loaders: [
            {
                test : /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-1']
                }
            }
        ]
    }
};