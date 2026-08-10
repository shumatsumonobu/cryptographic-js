# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-08-10

Existing code keeps working unchanged. Everything below is opt-in through the
new constructor option.

### Added

- `keyEncoding` constructor option (`'utf8'` | `'hex'`, default `'utf8'`) on all
  9 classes, controlling how string keys and IVs are turned into bytes

```js
const cipher = new AES256CBC({keyEncoding: 'hex'});
const key = cipher.createKey('hex');  // 64 characters, full 256-bit strength
const iv  = cipher.createIV('hex');   // 32 characters
cipher.encrypt('Hello World', key, iv);
```

- Validation of hex keys and IVs under `keyEncoding: 'hex'`. `Buffer.from(str, 'hex')`
  discards everything after the first non-hex character, so a corrupted key could
  previously shrink into one that still passed the length check

### Fixed

- `createKey('hex')` and `createIV('hex')` returned `keySize` and `ivSize`
  **characters** rather than bytes, so a hex key carried half the intended
  entropy (an AES-256 key held 128 bits). Under `keyEncoding: 'hex'` they now
  return `keySize * 2` and `ivSize * 2` characters. The `'utf8'` default keeps
  the old lengths so stored keys stay valid
- JSDoc described `key` and `iv` as hex strings while the implementation read
  them as UTF-8. Both now describe the behavior selected by `keyEncoding`
- The published type definitions imported through a `~/` path alias that only
  resolves inside this repository, so TypeScript could not load them. Classes
  silently fell back to `any` under `skipLibCheck`, and failed to resolve at all
  without it. Calls that only compiled because of that `any` may now report the
  type errors they always had

### Notes

- Under the `'utf8'` default a hex string still carries only 4 bits per
  character. Use `keyEncoding: 'hex'`, or `createKey('buffer')`, for a key at the
  algorithm's full strength

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
[1.1.0]: https://github.com/shumatsumonobu/cryptographic-js/compare/v1.0.3...v1.1.0
