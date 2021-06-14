# v3.0.0

Initial open source release.

* Reorganized build to use the modern ./dist directory.
* Removed any references to cPanel internal build resources that would be inaccessible to external developers.
* Updated the license to MIT for publication.

# v3.0.1

Removed testing files from ./dist.

# v3.0.2

Reworked the build so the developer build will can still run the tests.

# v3.0.3

Fixed the unit tests to run again.

# v3.0.4

Removed internal publication references.

# v3.0.5

Minor adjustments for the typescript publication in the npm module.

# v3.0.6

Changed to es5 code generation to get nodejs typescript to work.

# v3.0.7

Trying a different export strategy to get deep typescript object to publish.

# v3.0.8

Correctly exported the utils modules.

# v3.0.9

Updated the library version to remove low security threat

# v3.0.10

Add support for cPanel and WHM API tokens.
Add support to convert headers to an object using toObject() or an array using toArray(). This simplifies use with some libraries.
Fixed the examples in the README.md.

# v4.0.0

Switch default package management strategy to npm from yarn.

# v4.0.1

Patch to retain yarn support as older systems that utilize this require it.

# v5.0.0

Update @cpanel/API to support tree-shaking lodash