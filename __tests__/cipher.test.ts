import crypto from 'crypto';
import Cipher, {CipherOptions} from '../src/Cipher';
import {
  AES128CBC,
  AES128CFB,
  AES128CTR,
  AES192CBC,
  AES192CFB,
  AES192CTR,
  AES256CBC,
  AES256CFB,
  AES256CTR
} from '../src/index';

/** Constructor shape shared by all nine cipher classes. */
type CipherClass = new (options?: CipherOptions) => Cipher;

interface CipherEntry {
  name: string;
  Class: CipherClass;
  keySize: number;
  ivSize: number;
  /** What version 1.0.3 produced for PLAINTEXT with utf8Key(keySize) and UTF8_IV. */
  encrypted: string;
}

const PLAINTEXT = 'Hello World';
const UTF8_IV = 'fedcba9876543210';

/**
 * Builds a printable key of the given byte length by repeating a fixed pattern.
 * Used directly as a UTF-8 key, and hex encoded for the equivalent `'hex'` key.
 *
 * @param byteSize - Number of bytes, and therefore characters, to produce.
 * @returns A deterministic ASCII string of `byteSize` characters.
 */
function utf8Key(byteSize: number): string {
  return '0123456789abcdef0123456789abcdef'.slice(0, byteSize);
}

const CIPHERS: CipherEntry[] = [
  {name: 'AES128CBC', Class: AES128CBC, keySize: 16, ivSize: 16, encrypted: 'T8v4L8etvwn61ye9NRe3nw=='},
  {name: 'AES128CFB', Class: AES128CFB, keySize: 16, ivSize: 16, encrypted: 'Qy66HZlQKGbKVKc='},
  {name: 'AES128CTR', Class: AES128CTR, keySize: 16, ivSize: 16, encrypted: 'Qy66HZlQKGbKVKc='},
  {name: 'AES192CBC', Class: AES192CBC, keySize: 24, ivSize: 16, encrypted: 'C6cls0Q0MFwBM7ZNmc9iXg=='},
  {name: 'AES192CFB', Class: AES192CFB, keySize: 24, ivSize: 16, encrypted: 'siIjCqY7usM3Ayw='},
  {name: 'AES192CTR', Class: AES192CTR, keySize: 24, ivSize: 16, encrypted: 'siIjCqY7usM3Ayw='},
  {name: 'AES256CBC', Class: AES256CBC, keySize: 32, ivSize: 16, encrypted: 'YDNdjuuhwopIbMkVWEw7cw=='},
  {name: 'AES256CFB', Class: AES256CFB, keySize: 32, ivSize: 16, encrypted: 'lj0XM6PQGdsASII='},
  {name: 'AES256CTR', Class: AES256CTR, keySize: 32, ivSize: 16, encrypted: 'lj0XM6PQGdsASII='}
];

/**
 * One class per key size. Everything below this line exercises logic that lives
 * entirely in the shared base class, so running it against all nine classes
 * would only repeat the same lines. The three sizes are kept because the error
 * messages quote `keySize`.
 */
const KEY_SIZES = CIPHERS.filter(({name}) => name.endsWith('CBC'));

/**
 * The default mode has to keep producing exactly what 1.0.3 produced, otherwise
 * data already stored by existing installations stops decrypting. A round trip
 * cannot catch a drift here: encrypt and decrypt would move together and still
 * agree with each other.
 */
describe('the utf8 default reproduces 1.0.3 output', () => {
  for (const {name, Class, keySize, encrypted} of CIPHERS) {
    test(`${name} encrypts to the 1.0.3 ciphertext`, () => {
      expect(new Class().encrypt(PLAINTEXT, utf8Key(keySize), UTF8_IV)).toBe(encrypted);
    });
  }

  // 1.0.3 took no arguments, so a caller passing a config object that happened
  // to be null was harmless. A default parameter only covers undefined.
  test('a null argument falls back to utf8', () => {
    expect(new AES256CBC(null as any).keyEncoding).toBe('utf8');
  });
});

describe('encrypt and decrypt round trip', () => {
  for (const {name, Class, keySize, ivSize} of CIPHERS) {
    const utf8Cipher = new Class();
    const hexCipher = new Class({keyEncoding: 'hex'});

    test(`${name} round trips a utf8 string key`, () => {
      const key = utf8Key(keySize);
      const encrypted = utf8Cipher.encrypt(PLAINTEXT, key, UTF8_IV);
      expect(utf8Cipher.decrypt(encrypted, key, UTF8_IV)).toBe(PLAINTEXT);
    });

    test(`${name} round trips a Buffer key in either mode`, () => {
      const key = crypto.randomBytes(keySize);
      const iv = crypto.randomBytes(ivSize);
      for (const cipher of [utf8Cipher, hexCipher]) {
        expect(cipher.decrypt(cipher.encrypt(PLAINTEXT, key, iv), key, iv)).toBe(PLAINTEXT);
      }
    });

    test(`${name} round trips a generated hex key and IV`, () => {
      const key = hexCipher.createKey('hex');
      const iv = hexCipher.createIV('hex');
      expect(hexCipher.decrypt(hexCipher.encrypt(PLAINTEXT, key, iv), key, iv)).toBe(PLAINTEXT);
    });
  }
});

describe('createKey and createIV sizing', () => {
  for (const {name, Class, keySize, ivSize} of CIPHERS) {
    const utf8Cipher = new Class();
    const hexCipher = new Class({keyEncoding: 'hex'});

    test(`${name} returns Buffers of the algorithm size by default`, () => {
      for (const cipher of [utf8Cipher, hexCipher]) {
        const key = cipher.createKey();
        const iv = cipher.createIV();
        // Under utf8 a hex string would have the same character count as the
        // byte count, so the type has to be asserted alongside the length.
        expect(Buffer.isBuffer(key)).toBe(true);
        expect(Buffer.isBuffer(iv)).toBe(true);
        expect((key as Buffer).length).toBe(keySize);
        expect((iv as Buffer).length).toBe(ivSize);
      }
    });

    test(`${name} keeps the 1.0.3 hex lengths under utf8`, () => {
      expect((utf8Cipher.createKey('hex') as string).length).toBe(keySize);
      expect((utf8Cipher.createIV('hex') as string).length).toBe(ivSize);
    });

    // The reported bug: a hex key used to carry half the algorithm's key
    // strength. Decoding is what proves both the length and the character set.
    test(`${name} hex output decodes to the full key and IV size`, () => {
      expect(Buffer.from(hexCipher.createKey('hex') as string, 'hex').length).toBe(keySize);
      expect(Buffer.from(hexCipher.createIV('hex') as string, 'hex').length).toBe(ivSize);
    });
  }
});

describe('key and IV length validation', () => {
  for (const {name, Class, keySize, ivSize} of KEY_SIZES) {
    test(`${name} rejects a short utf8 key`, () => {
      expect(() => new Class().encrypt('x', utf8Key(keySize - 1), UTF8_IV))
        .toThrow(`Key length must be ${keySize} bytes long`);
    });

    test(`${name} rejects a short IV`, () => {
      expect(() => new Class().encrypt('x', utf8Key(keySize), UTF8_IV.slice(0, ivSize - 1)))
        .toThrow(`IV length must be ${ivSize} bytes long`);
    });

    test(`${name} rejects a hex key of the wrong byte length`, () => {
      const cipher = new Class({keyEncoding: 'hex'});
      expect(() => cipher.encrypt('x', '0'.repeat(keySize), Buffer.from(UTF8_IV).toString('hex')))
        .toThrow(`Key length must be ${keySize} bytes long`);
    });

    test(`${name} validates decrypt as well as encrypt`, () => {
      expect(() => new Class().decrypt('AAAA', utf8Key(keySize - 1), UTF8_IV))
        .toThrow(`Key length must be ${keySize} bytes long`);
    });
  }

  test('a key generated for the other encoding is rejected', () => {
    const utf8Cipher = new AES256CBC();
    const hexCipher = new AES256CBC({keyEncoding: 'hex'});
    expect(() => hexCipher.encrypt('x', utf8Cipher.createKey('hex'), hexCipher.createIV('hex'))).toThrow();
    expect(() => utf8Cipher.encrypt('x', hexCipher.createKey('hex'), utf8Cipher.createIV('hex'))).toThrow();
  });
});

describe('hex input validation', () => {
  const cipher = new AES256CBC({keyEncoding: 'hex'});
  const key = '0'.repeat(64);
  const iv = '0'.repeat(32);

  test('accepts the 64-character key the documentation describes', () => {
    expect(() => cipher.encrypt('x', key, iv)).not.toThrow();
  });

  test('rejects a key holding non-hex characters', () => {
    expect(() => cipher.encrypt('x', 'z'.repeat(64), iv))
      .toThrow("Key must be a hex string when keyEncoding is 'hex'");
  });

  test('rejects an odd-length key', () => {
    expect(() => cipher.encrypt('x', '0'.repeat(63), iv))
      .toThrow("Key must be a hex string when keyEncoding is 'hex'");
  });

  test('rejects trailing garbage instead of silently truncating', () => {
    // Buffer.from stops at the first non-hex character, so this would otherwise
    // decode to exactly 32 bytes and pass the length check unnoticed.
    expect(() => cipher.encrypt('x', `${key}zz${key}`, iv))
      .toThrow("Key must be a hex string when keyEncoding is 'hex'");
  });

  test('reports the IV separately from the key', () => {
    expect(() => cipher.encrypt('x', key, `zz${'0'.repeat(30)}`))
      .toThrow("IV must be a hex string when keyEncoding is 'hex'");
  });

  test('accepts uppercase hex', () => {
    const upper = 'ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789';
    expect(cipher.encrypt('x', upper, iv)).toBe(cipher.encrypt('x', upper.toLowerCase(), iv));
  });

  test('leaves byte input unvalidated', () => {
    const keyBytes = Buffer.alloc(32, 0xff);
    const ivBytes = Buffer.alloc(16, 0xff);
    expect(() => cipher.encrypt('x', keyBytes, ivBytes)).not.toThrow();
    // Only strings carry an encoding. Every byte container 1.0.3 accepted has to
    // keep working here, or hex mode would reject keys utf8 mode takes.
    expect(() => cipher.encrypt('x', new Uint8Array(keyBytes) as any, new Uint8Array(ivBytes) as any)).not.toThrow();
  });

  test('does not apply hex validation under the utf8 default', () => {
    expect(() => new AES256CBC().encrypt('x', 'z'.repeat(32), UTF8_IV)).not.toThrow();
  });
});
