# cryptographic-js

[![npm](https://img.shields.io/npm/v/cryptographic-js)](https://www.npmjs.com/package/cryptographic-js)
[![license](https://img.shields.io/npm/l/cryptographic-js)](LICENSE)

Lightweight AES encryption and decryption for Node.js.
Supports multiple key lengths and cipher modes with a simple, unified API.

## Supported Algorithms

| Mode | 128-bit | 192-bit | 256-bit |
|:-----|:-------:|:-------:|:-------:|
| CTR  | AES-128-CTR | AES-192-CTR | AES-256-CTR |
| CBC  | AES-128-CBC | AES-192-CBC | AES-256-CBC |
| CFB  | AES-128-CFB | AES-192-CFB | AES-256-CFB |

## Installation

```sh
npm install cryptographic-js
```

## Quick Start

```js
import {AES256CBC} from 'cryptographic-js';

const cipher = new AES256CBC();

// Generate key and IV
const key = cipher.createKey('hex');
const iv  = cipher.createIV('hex');

// Encrypt
const encrypted = cipher.encrypt('Hello World', key, iv);
// => "<encrypted>"

// Decrypt
const decrypted = cipher.decrypt(encrypted, key, iv);
// => "Hello World"
```

All 9 classes share the same interface. Just swap the import:

```js
import {AES256CTR} from 'cryptographic-js';  // AES-256-CTR
import {AES192CFB} from 'cryptographic-js';  // AES-192-CFB
import {AES128CBC} from 'cryptographic-js';  // AES-128-CBC
// ... and so on
```

## API

Every class provides four methods:

### `encrypt(plaintext, key, iv, outputEncoding?)`

Encrypts a plaintext string.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `plaintext` | `string` | Text to encrypt |
| `key` | `string \| Buffer` | Encryption key |
| `iv` | `string \| Buffer` | Initialization vector |
| `outputEncoding` | `'base64' \| 'hex' \| 'binary'` | Output format (default: `'base64'`) |

**Returns** `string` — The encrypted data.

### `decrypt(encrypted, key, iv, inputEncoding?)`

Decrypts an encrypted string.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `encrypted` | `string` | Encrypted text |
| `key` | `string \| Buffer` | Encryption key |
| `iv` | `string \| Buffer` | Initialization vector |
| `inputEncoding` | `'base64' \| 'hex' \| 'binary'` | Input format (default: `'base64'`) |

**Returns** `string` — The decrypted plaintext.

### `createKey(type?)`

Generates a random encryption key with the correct length for the algorithm.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `type` | `'buffer' \| 'hex'` | Return type (default: `'buffer'`) |

**Returns** `Buffer | string`

### `createIV(type?)`

Generates a random initialization vector (16 bytes).

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `type` | `'buffer' \| 'hex'` | Return type (default: `'buffer'`) |

**Returns** `Buffer | string`

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
