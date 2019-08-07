const path = require('path');
const webpack = require('webpack');
const commonConfig = {
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'dist', 'bundles'),
        library: ['cp', 'api'],
        libraryTarget: 'umd'
    }
};
function buildConfig(env) {
    if (env === 'dev') {
        // Object.assign doesn't do deep copy. Using JSON.parse as suggested in MDN.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Deep_Clone
        let devConfigOptions = JSON.parse(JSON.stringify(commonConfig));
        devConfigOptions.mode = 'development';
        devConfigOptions.output.filename = 'cpanel-api.umd.js';
        return devConfigOptions;
    } else if (env === 'prod') {
        let prodConfigOptions = JSON.parse(JSON.stringify(commonConfig));
        prodConfigOptions.mode = 'production';
        prodConfigOptions.output.filename = 'cpanel-api.umd.min.js';
        return prodConfigOptions;
    } else {
        console.log("Wrong webpack build parameter. Possible choices: 'dev' or 'prod'.")
    }
}

module.exports = buildConfig;