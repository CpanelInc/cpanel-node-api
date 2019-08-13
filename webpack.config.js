const path = require('path');
const webpack = require('webpack');
const commonConfig = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'bundles'),
        library: ['cp', 'api'],
        libraryTarget: 'umd'
    }
};
function buildConfig(env) {
    if (env === 'dev') {
        let devConfigOptions = commonConfig;
        devConfigOptions.mode = 'development';
        devConfigOptions.output.filename = 'cpanel-api.umd.js';
        return devConfigOptions;
    } else if (env === 'prod') {
        let prodConfigOptions = commonConfig;
        prodConfigOptions.mode = 'production';
        prodConfigOptions.output.filename = 'cpanel-api.umd.min.js';
        return prodConfigOptions;
    } else {
        console.log("Wrong webpack build parameter. Possible choices: 'dev' or 'prod'.")
    }
}

module.exports = buildConfig;