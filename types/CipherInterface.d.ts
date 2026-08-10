/// <reference types="node" />
/**
 * Interface for AES cipher implementations.
 */
export default interface CipherInterface {
    /** Algorithm name passed to Node.js crypto (e.g. `'aes-256-cbc'`). */
    readonly algorithm: string;
    /** Key length in bytes (16 = 128-bit, 24 = 192-bit, 32 = 256-bit). */
    readonly keySize: number;
    /** IV length in bytes (always 16 for AES). */
    readonly ivSize: number;
    /**
     * How key and IV strings are interpreted: `'utf8'` uses them as raw bytes,
     * `'hex'` hex decodes them. Set through the constructor. Default: `'utf8'`.
     */
    readonly keyEncoding: 'utf8' | 'hex';
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
}
