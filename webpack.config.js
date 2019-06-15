const path = require('path');
const IGNORES = [
    'electron'
];

module.exports = {
    entry: './renderer/src/index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, './renderer/dist/')
    },
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: ['babel-plugin-transform-class-properties'],
                        compact: false,
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.(le|c)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    }, {
                        loader: 'less-loader',
                        options: {
                            modules: true,
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(le|c)ss$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader',
                        options: {
                            modules: true,
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: 'url-loader?limit=100000'
                }
            }
        ]
    },
    externals: [
        (context, request, callback) => {
            if (IGNORES.indexOf(request) >= 0) {
                return callback(null, "require('" + request + "')");
            }
            return callback();
        }
    ]
};