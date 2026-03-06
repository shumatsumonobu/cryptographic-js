# Changelog

All notable changes to this project will be documented in this file.

## [1.0.3] - 2026-03-06

### Improved

- Unified API documentation directly in README
- Added JSDoc to all public classes and methods for better IDE support
- Removed `version` export (use `package.json` version instead)

## [1.0.2] - 2021-09-18

### Fixed

- Corrected IV length validation error message
- Cleaned up example code

## [1.0.1] - 2020-12-02

### Added

- Output encoding option (`'base64'` | `'hex'` | `'binary'`) for `encrypt()` and `decrypt()`

```js
const cipher = new AES256CTR();
const key = cipher.createKey('hex');
const iv  = cipher.createIV('hex');

const encrypted = cipher.encrypt('Hello, World!', key, iv, 'hex');
const decrypted = cipher.decrypt(encrypted, key, iv, 'hex');
```

## [1.0.0] - 2020-12-01

### Released

- Initial release with support for AES-128/192/256 in CTR, CBC, and CFB modes

[1.0.0]: https://github.com/shumatsumonobu/cryptographic-js/releases/tag/v1.0.0
[1.0.1]: https://github.com/shumatsumonobu/cryptographic-js/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/shumatsumonobu/cryptographic-js/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/shumatsumonobu/cryptographic-js/compare/v1.0.2...v1.0.3
