# @cpanel/api Libraries

cPanel Api JavaScript and TypeScript interface libraries.

This library provides a set of classes for calling cPanel Whm API 1 and UAPI calls. The classes hide much of the complexity of these API's behind classes the abstract the underlying variances between these API systems. Users of this library can focus on what they want to accomplish rather the having to learn the various complexities of the underlying wire formats for each of the cPanel Products APIs

## Installing @cpanel/api

To install these libraries with Yarn, run:

```sh
yarn add @cpanel/api
```

## Using @cpanel/api

### TypeScript

```ts
import { api } from '@cpanel/api';
```

#### Calling a WHM Api 1 function

```ts
import { WhmApiType } from "@cpanel/api/whmapi/request";
import { WhmApiResponse, WhmApiRequest } from "@cpanel/api/whmapi";
import { Argument } from "@cpanel/api/utils/argument";

const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_token_create",
            arguments: [
                new Argument('token_name', 'my-Auth-Token'),
                // ---- API Token Permissions ----
                // Login to the UI
                new Argument('acl', 'create-user-session'),
                // Delete a token
                new Argument('acl', 'manage-api-tokens'),
            ]
        }).generate();

fetch('http://my-cpanel-server.com:2087', {
    method: 'POST',
    headers: request.headers.reduce(
        (obj, h) => {
            obj[h.name] = h.value;
            return obj;
        }, {}),
    body: request.body
})
  .then(response => response.json())
  .then(response => {
      response.data = new WhmApiResponse(response.data);
      if(!response.data.status) {
        throw new Error(response.data.errors[0].message);
      }
      return response;
  })
  .then(data => console.log(data));
```

### JavaScript

```js
var api = require('@cpanel/api');
```

#### Calling a WHM Api 1 function

```js
let WhmApiType = require("@cpanel/api/dist/whmapi/request");
let { WhmApiResponse, WhmApiRequest } = require("@cpanel/api/dist/whmapi");
let { Argument } = require("@cpanel/api/dist/utils/argument");

const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_token_create",
            arguments: [
                new Argument('token_name', 'my-Auth-Token'),
                // ---- API Token Permissions ----
                // Login to the UI
                new Argument('acl', 'create-user-session'),
                // Delete a token
                new Argument('acl', 'manage-api-tokens'),
            ]
        }).generate();

fetch('http://my-cpanel-server.com:2087', {
    method: 'POST',
    headers: request.headers.reduce(
        (obj, h) => {
            obj[h.name] = h.value;
            return obj;
        }, {}),
    body: request.body
})
  .then(response => response.json())
  .then(response => {
      response.data = new WhmApiResponse(response.data);
      if(!response.data.status) {
        throw new Error(response.data.errors[0].message);
      }
      return response;
  })
  .then(data => console.log(data));
```

## Development

1. Set up your development environment to test the local version of your library rather than the one distributed on `npm.dev.cpanel.net`:

    ```sh
    yarn install --dev
    yarn run build
    ```

2. Make the changes to the library.
3. Rebuild the library:

    ```sh
    yarn run build
    ```

## Testing

To install the development dependencies, run:

```sh
yarn install --dev
yarn run test
```

## Contributing

The maintainer will evaluate all bugs and feature requests, and reserves the right to reject request for any reason.

### Bugs

Please submit bugs via the github [issue tracker](https://github.com/CpanelInc/cpanel-node-api/issues). Bug reports must include the following:

1. The version of the @cpanel/api library.
2. The version of cPanel & WHM you are testing against.
3. A step by step set of instructions on how to reproduce the bug.
4. Sample code that reproduces the bug.

The maintainers will evaluate all bugs.

### Improvements and Feature Requests

Please submit feature requests via the github [issue tracker](https://github.com/CpanelInc/cpanel-node-api/issues).

Describe the feature in detail. Try to include information on why the suggested feature would be valuable and under what scenarios.

### Pull requests

We welcome pull request against the @cpanel/api library.

The maintainers will evaluate all pull request. Pull requests are subject to review by the maintainers. We may request additional adjustments to any submitted pull requests.

Any code submitted via pull requests that is incorporated into the library will become the property of cPanel L.L.C. and will be published under the cPanel L.L.C. copyright and the MIT license.

## Publishing

**Note** Publishing is limited to select cPanel maintainers.

When your changes are implemented and tested, and you're ready to publish, run:

```sh
yarn install
yarn run build
yarn publish
git push
```

After you run `yarn publish`, the system will prompt you to select a change type:

* *Patch* — Select this option for patches or very small changes (like fixing a typo).
* *Minor* — Select this option for small bug fixes.
* *Major* — Select this option for major changes, like adding new functionality.

## Authors

* **Team Phoenix @ cPanel**
* **Team Artemis @ cPanel**

### Contributors
* Thomas Green <tomg@cpanel.net>
* Sruthi Sanigarapu <sruthi@cpanel.net>
* Aneece Yazdani <aneece@cpanel.net>

## License
Copyright © 2021 cPanel, L.L.C.
Licensed under the included [MIT](https://github.com/CpanelInc/cpanel-node-api/blob/main/LICENSE) license.
