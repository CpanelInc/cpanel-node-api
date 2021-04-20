# @cpanel/api Libraries

cPanel API JavaScript and TypeScript interface libraries.

This library provides a set of classes for calling cPanel WHM API 1 and UAPI calls. The classes hide much of the complexity of these API's behind classes that abstract the underlying variances between these API systems. Users of this library can focus on what they want to accomplish rather than having to learn the various complexities of the underlying wire formats for each of the cPanel product's APIs.

## Installing @cpanel/api

To install these libraries with NPM, run:

```sh
npm install @cpanel/api
```

## Using @cpanel/api

### TypeScript

#### Calling a WHM API 1 function

```ts
import {
    Argument,
    WhmApiResponse,
    WhmApiRequest,
    WhmApiType,
    WhmApiTokenHeader
} from "@cpanel/api";

const token = "...paste your API token here...";
const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_token_create",
            arguments: [
                new Argument('token_name', 'my-Auth-Token'),
                // ---- API Token Permissions ----
                // Login to the UI
                new Argument('acl', 'create-user-session'),
                // Delete a token
                new Argument('acl', 'manage-api-tokens'),
            ],
            headers: [
                new WhmApiTokenHeader(token, 'root'),
            ],
        }).generate();

fetch('http://my-cpanel-server.com:2087', {
    method: 'POST',
    headers: request.headers.toObject(),
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

#### Calling a WHM API 1 function

```js
let {
    Argument,
    WhmApiResponse,
    WhmApiRequest,
    WhmApiType,
    WhmApiTokenHeader
} = require("@cpanel/api");

const token = "...paste your API token here...";
const request = new WhmApiRequest(WhmApiType.JsonApi, {
            method: "api_token_create",
            arguments: [
                new Argument('token_name', 'my-Auth-Token'),
                // ---- API Token Permissions ----
                // Login to the UI
                new Argument('acl', 'create-user-session'),
                // Delete a token
                new Argument('acl', 'manage-api-tokens'),
            ],
            headers: [
                new WhmApiTokenHeader(token, 'root'),
            ],
        }).generate();

fetch('http://my-cpanel-server.com:2087', {
    method: 'POST',
    headers: request.headers.toObject()),
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
    npm install --also=dev
    npm run build:dev
    ```

2. Make the changes to the library.
3. Rebuild the library:

    ```sh
    npm run build:dev
    ```

## Testing

To install the development dependencies, run:

```sh
npm install --also=dev
npm run test
```

## Contributing

The maintainer will evaluate all bugs and feature requests, and reserves the right to reject a request for any reason.

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

We welcome pull requests against the @cpanel/api library.

The maintainers will evaluate all pull requests. Pull requests are subject to review by the maintainers. We may request additional adjustments to any submitted pull requests.

Any code submitted via pull requests that is incorporated into the library will become the property of cPanel L.L.C. and will be published under the cPanel L.L.C. copyright and the MIT license.

## Publishing

**Note** Publishing is limited to select cPanel maintainers.

When your changes are implemented and tested, and you're ready to publish, run:

### Developer publishing (publishing an alpha build for testing)

1. As part of the development changes update the `version` property in `package.json` to the format `X.X.X-alpha.X` so that the semver is updated correctly and appended with alpha build information (1.0.0 -> 1.0.1-alpha.1).
2. `npm run publish`
3. Confirm changes are properly published at http://alpha.docs.ui.dev.cpanel.net/locale

### Production publishing (This will be done by a UI3)

1. When dev changes are accepted and complete update the `version` property in `package.json` to the format `X.X.X` so that the semver is updated correctly and alpha build information has been removed. Do this on the development branch before merging pull request (1.0.1-alpha.1 -> 1.0.1).
2. `npm run publish`

## Authors

* **Team Phoenix @ cPanel**
* **Team Artemis @ cPanel**
* **Team Cobra   @ cPanel**

### Contributors
* Thomas Green <tomg@cpanel.net>
* Sruthi Sanigarapu <sruthi@cpanel.net>
* Aneece Yazdani <aneece@cpanel.net>
* Sarah Kiniry <sarah.kiniry@cpanel.net>
* Dustin Scherer <dustin.scherer@cpanel.net>
* Philip King <phil@cpanel.net>
* Caitlin Flattery <c.flattery@cpanel.net>

## License
Copyright © 2021 cPanel, L.L.C.
Licensed under the included [MIT](https://github.com/CpanelInc/cpanel-node-api/blob/main/LICENSE) license.
