/// <reference types="node" />
import CipherInterface from '~/CipherInterface';
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
    /**
     * Encrypts a plaintext string.
     *
     * @param plaintext      - The text to encrypt.
     * @param key            - Encryption key as a hex string or Buffer.
     * @param iv             - Initialization vector as a hex string or Buffer.
     * @param outputEncoding - Encoding of the returned ciphertext. Default: `'base64'`.
     * @returns The encrypted string in the specified encoding.
     */
    encrypt(plaintext: string, key: string | Buffer, iv: string | Buffer, outputEncoding?: 'hex' | 'binary' | 'base64'): string;
    /**
     * Decrypts an encrypted string back to plaintext.
     *
     * @param encrypted      - The encrypted string to decrypt.
     * @param key            - Encryption key used during encryption.
     * @param iv             - Initialization vector used during encryption.
     * @param inputEncoding  - Encoding of the input ciphertext. Default: `'base64'`.
     * @returns The decrypted plaintext string.
     */
    decrypt(encrypted: string, key: string | Buffer, iv: string | Buffer, inputEncoding?: 'hex' | 'binary' | 'base64'): string;
    /**
     * Generates a random encryption key with the correct length for this algorithm.
     *
     * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
     * @returns A randomly generated encryption key.
     */
    createKey(type?: 'buffer' | 'hex'): Buffer | string;
    /**
     * Generates a random initialization vector (IV).
     *
     * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
     * @returns A randomly generated IV.
     */
    createIV(type?: 'buffer' | 'hex'): Buffer | string;
}
