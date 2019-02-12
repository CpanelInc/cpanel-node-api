# @cpanel/api

> cPanel Api JavaScript and TypeScript libraries

## Install

Install with yarn

```sh
$ yarn add --registry http://npm.dev.cpanel.net api
```

## Usage

## TypeScript

```ts
import { api } from '@cpanel/api';

// TODO:
```

## JavaScript

```js
var api = require('api');

// TODO:

```

## Development

1. Setup your development environment.

```sh
$ yarn --registry http://npm.dev.cpanel.net --dev
$ yarn run build
$ yarn run link:cpanel link:webmail link:whm
```

This lets you test the local version of your library rather than the one distributed on npm.dev.cpanel.net.

2. Make your changes to the api library.
3. Rebuild the library
```sh
$ yarn run build
```
4. Test your changes in one of the cPanel application spaces.

## Running tests

Install dev dependencies:

```sh
$ yarn --registry http://npm.dev.cpanel.net --dev
$ yarn run test
```

## Publishing


```sh
$ yarn --registry http://npm.dev.cpanel.net
$ yarn run build
$ npm publish
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://jira.cpanel.net)

## Author

**Team Phoenix @ cPanel**

### Contributors

* Thomas Green <tomg@cpanel.net>
* Sruthi Sanigarapu <sruthi@cpanel.net>
* Aneece Yazdani <aneece@cpanel.net>

## License

Copyright © 2019 cPanel, L.L.C.
Licensed under the SEE LICENSE IN LICENSE license.
