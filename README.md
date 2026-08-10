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

const cipher = new AES256CBC({keyEncoding: 'hex'});

// Generate key and IV
const key = cipher.createKey('hex');  // 64 hex characters = 32 bytes
const iv  = cipher.createIV('hex');   // 32 hex characters = 16 bytes

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

## Upgrading from 1.0.x

Nothing to change. Left alone, every class behaves exactly as it did in 1.0.3,
down to the bytes it produces, so keys and ciphertext already in use keep
working. `keyEncoding` only changes behavior for the code that passes it.

## Key and IV Encoding

`keyEncoding` decides how a **string** key or IV is turned into bytes. A Buffer
key or IV is used as-is and is unaffected by this setting.

| `keyEncoding` | String key | String IV | Strength of a `createKey('hex')` key |
|:--------------|:-----------|:----------|:-------------------------------------|
| `'hex'` | `keySize * 2` characters, hex decoded | `ivSize * 2` characters, hex decoded | Full `keySize * 8` bits |
| `'utf8'` (default) | `keySize` characters, used as raw bytes | `ivSize` characters, used as raw bytes | Half: `keySize * 4` bits |

Use `keyEncoding: 'hex'` for new code. Under the `'utf8'` default a hex string
only carries 4 bits per character, so `createKey('hex')` returns a key with half
the strength the algorithm name implies:

| Class | `keyEncoding: 'hex'` | `'utf8'` (default) |
|:------|:---------------------|:-------------------|
| AES-128 | 32 characters, 128-bit | 16 characters, 64-bit |
| AES-192 | 48 characters, 192-bit | 24 characters, 96-bit |
| AES-256 | 64 characters, 256-bit | 32 characters, 128-bit |

`'utf8'` remains the default so that data encrypted with earlier versions keeps
decrypting. `createKey('buffer')` and `createIV('buffer')` are always full
strength in both modes.

### Moving an existing deployment to `'hex'`

A `'hex'` instance reads the same key as a `'utf8'` instance would once the key
is hex encoded, so stored ciphertext stays readable and nothing has to be
re-encrypted:

```js
const modern = new AES256CBC({keyEncoding: 'hex'});
const key = Buffer.from(storedKey).toString('hex');
const iv  = Buffer.from(storedIV).toString('hex');

modern.decrypt(stored, key, iv);  // same result as new AES256CBC().decrypt(stored, storedKey, storedIV)
```

That switch alone does not make the key any stronger. A key that came from
`createKey('hex')` under `'utf8'` still carries half the algorithm's strength,
and only a new key fixes that. Rotating one means decrypting with the old key
and re-encrypting with the new one:

```js
const legacy = new AES256CBC();                      // reads keys as utf8
const modern = new AES256CBC({keyEncoding: 'hex'});  // reads keys as hex

const newKey = modern.createKey('hex');
const newIV  = modern.createIV('hex');

const plaintext = legacy.decrypt(stored, storedKey, storedIV);
const migrated  = modern.encrypt(plaintext, newKey, newIV);
```

## API

### `new AES256CBC(options?)`

Creates a cipher. Every class takes the same options.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `options.keyEncoding` | `'utf8' \| 'hex'` | How string keys and IVs are interpreted (default: `'utf8'`) |

### `encrypt(plaintext, key, iv, outputEncoding?)`

Encrypts a plaintext string.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `plaintext` | `string` | Text to encrypt |
| `key` | `string \| Buffer` | Encryption key, sized per `keyEncoding` |
| `iv` | `string \| Buffer` | Initialization vector, sized per `keyEncoding` |
| `outputEncoding` | `'base64' \| 'hex' \| 'binary'` | Output format (default: `'base64'`) |

**Returns** `string` — The encrypted data.

**Throws** if the key or IV is the wrong byte length, or if `keyEncoding` is
`'hex'` and the string is not valid hex.

### `decrypt(encrypted, key, iv, inputEncoding?)`

Decrypts an encrypted string.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `encrypted` | `string` | Encrypted text |
| `key` | `string \| Buffer` | Encryption key, sized per `keyEncoding` |
| `iv` | `string \| Buffer` | Initialization vector, sized per `keyEncoding` |
| `inputEncoding` | `'base64' \| 'hex' \| 'binary'` | Input format (default: `'base64'`) |

**Returns** `string` — The decrypted plaintext.

**Throws** under the same conditions as `encrypt`.

### `createKey(type?)`

Generates a random encryption key with the correct length for the algorithm and
the instance `keyEncoding`.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `type` | `'buffer' \| 'hex'` | Return type (default: `'buffer'`) |

**Returns** `Buffer | string` — A Buffer is always `keySize` bytes. A hex string
is `keySize * 2` characters under `keyEncoding: 'hex'`, and `keySize` characters
under `'utf8'`.

### `createIV(type?)`

Generates a random initialization vector, sized by the same rules as `createKey`.

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `type` | `'buffer' \| 'hex'` | Return type (default: `'buffer'`) |

**Returns** `Buffer | string`

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
