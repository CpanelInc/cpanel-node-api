const path = require('path');
const webpack = require('webpack');
const commonConfig = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'bundles'),
        filename: 'cpanel-api.umd.js',
        library: ['cp', 'api'],
        libraryTarget: 'umd'
    }
};
function buildConfig(env) {
    if (env === 'dev') {
        return Object.assign({}, { 'mode': 'development' }, commonConfig);
    } else if (env === 'prod') {
        let prodConfigOptions = {
            'mode': 'production',
            'output': {
                filename: 'cpanel-locale.umd.min.js'
            }
        };
        return Object.assign({}, commonConfig, prodConfigOptions);
    } else {
        console.log("Wrong webpack build parameter. Possible choices: 'dev' or 'prod'.")
    }
}

module.exports = buildConfig;