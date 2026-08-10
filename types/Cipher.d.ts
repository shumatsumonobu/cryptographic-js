/// <reference types="node" />
import CipherInterface from './CipherInterface';
/**
 * Options accepted by every cipher constructor.
 */
export interface CipherOptions {
    /**
     * How key and IV strings are interpreted. Default: `'utf8'`.
     *
     * - `'utf8'` — strings are used as raw UTF-8 bytes, so a key must be exactly
     *   `keySize` characters and an IV exactly `ivSize` characters. This is the
     *   default so that existing data stays decryptable, but a hex string carries
     *   only 4 bits per character: a 32-character AES-256 key holds 128 bits of
     *   entropy, not 256.
     * - `'hex'` — strings are hex decoded, so a key must be `keySize * 2`
     *   characters and an IV `ivSize * 2` characters. This is the only mode in
     *   which a string key reaches its full strength, and it is recommended for
     *   new code.
     *
     * A Buffer key or IV is used as-is in both modes.
     */
    keyEncoding?: 'utf8' | 'hex';
}
/**
 * Abstract base class for all AES cipher implementations.
 * Provides encrypt, decrypt, key generation, and IV generation.
 */
export default abstract class Cipher implements CipherInterface {
    /** Algorithm name passed to Node.js crypto (e.g. `'aes-256-cbc'`). */
    readonly algorithm: string;
    /** Key length in bytes (16 = 128-bit, 24 = 192-bit, 32 = 256-bit). */
    readonly keySize: number;
    /** IV length in bytes (always 16 for AES). */
    readonly ivSize: number;
    /** How key and IV strings are interpreted. See {@link CipherOptions.keyEncoding}. */
    readonly keyEncoding: 'utf8' | 'hex';
    /**
     * @param options - Cipher options. Omit to keep the default UTF-8 behavior.
     *                  Guarded against a null argument so that callers written
     *                  against the previous no-argument constructor keep working.
     */
    constructor(options?: CipherOptions);
    /**
     * Encrypts a plaintext string.
     *
     * @param plaintext      - The text to encrypt.
     * @param key            - Encryption key as a Buffer, or as a string in this
     *                         instance's `keyEncoding` (`keySize` characters for
     *                         `'utf8'`, `keySize * 2` for `'hex'`).
     * @param iv             - Initialization vector, following the same rules as `key`.
     * @param outputEncoding - Encoding of the returned ciphertext. Default: `'base64'`.
     * @returns The encrypted string in the specified encoding.
     */
    encrypt(plaintext: string, key: string | Buffer, iv: string | Buffer, outputEncoding?: 'hex' | 'binary' | 'base64'): string;
    /**
     * Decrypts an encrypted string back to plaintext.
     *
     * @param encrypted      - The encrypted string to decrypt.
     * @param key            - Encryption key used during encryption, in the same
     *                         form accepted by `encrypt`.
     * @param iv             - Initialization vector used during encryption.
     * @param inputEncoding  - Encoding of the input ciphertext. Default: `'base64'`.
     * @returns The decrypted plaintext string.
     */
    decrypt(encrypted: string, key: string | Buffer, iv: string | Buffer, inputEncoding?: 'hex' | 'binary' | 'base64'): string;
    /**
     * Generates a random encryption key with the correct length for this algorithm.
     *
     * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
     * @returns A randomly generated encryption key. A `'buffer'` key is always
     *          `keySize` bytes. A `'hex'` key is `keySize * 2` characters when
     *          `keyEncoding` is `'hex'`, and `keySize` characters when it is
     *          `'utf8'` — the latter holds only half the algorithm's key strength,
     *          so prefer `'buffer'` or `keyEncoding: 'hex'`.
     */
    createKey(type?: 'buffer' | 'hex'): Buffer | string;
    /**
     * Generates a random initialization vector (IV).
     *
     * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
     * @returns A randomly generated IV, sized by the same rules as `createKey`.
     */
    createIV(type?: 'buffer' | 'hex'): Buffer | string;
    /**
     * Converts a key and IV to Buffers and checks both against the lengths this
     * algorithm requires.
     *
     * @param key - Encryption key, in any form `encrypt` accepts.
     * @param iv  - Initialization vector, following the same rules as `key`.
     * @returns The key and IV as Buffers of the required length.
     */
    private toKeyAndIV;
    /**
     * Converts a key or IV to a Buffer using this instance's `keyEncoding`.
     *
     * @param value - The key or IV to convert. Buffers are returned untouched.
     * @param label - Name used in the error message.
     * @returns The value as a Buffer.
     */
    private toBuffer;
    /**
     * Number of characters a hex string needs to carry the given byte count.
     *
     * @param byteSize - Byte length the string has to represent.
     * @returns `byteSize * 2` under `'hex'`, or `byteSize` under `'utf8'`, where
     *          each character is consumed as one byte.
     */
    private hexLength;
}
