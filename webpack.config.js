'use strict';

var webpack = require('webpack');
//var path = require('path');

module.exports = {
    entry: './src/randomair/randomair.jsx',
    output: {
        path: __dirname,
        filename: './public/js/randomair.js'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
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
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
};

// module.exports = {
//     entry: './src/randomair/randomair.jsx',
//     output: {
//         path: __dirname,
//         filename: './public/js/randomair.js'
//     },
//     resolveLoader: {
//         root: path.join(__dirname, 'node_modules')
//     },
//     module: {
//         loaders: [{
//             test: /\.jsx$/,
//             include: [
//                 path.resolve(__dirname, 'src/randomair')
//             ],
//             loader: 'babel-loader',
//             query: {
//                 presets: ['es2015', 'react', 'stage-1']
//             }
//         },{
//             test: /\.json$/,
//             loader: 'json-loader'
//         }]
//     }
//     // resolve: {
//     //     extensions: ['', '.webpack.js', '.web.js', '.js']
//     // },
//     // context: __dirname,
//     // resolveLoader: {
//     //     modulesDirectories: [
//     //         'node_modules'
//     //     ]
//     //      //extensions: ['','.js','.jsx']
//     //  },
//     // module: {
//     //     loaders: [
//     //         {
//     //             test : /.jsx?$/,
//     //             exclude: /node_modules/,
//     //             loader: 'babel-loader',
//     //             query: {
//     //                 presets: ['es2015', 'react', 'stage-1']
//     //             }
//     //         }
//     //     ]
//     // }
// };