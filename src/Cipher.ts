import CipherInterface from '~/CipherInterface';
import crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';

/**
 * Abstract base class for all AES cipher implementations.
 * Provides encrypt, decrypt, key generation, and IV generation.
 */
export default abstract class Cipher implements CipherInterface {
  /** Algorithm name passed to Node.js crypto (e.g. `'aes-256-cbc'`). */
  public readonly algorithm: string = '';

  /** Key length in bytes (16 = 128-bit, 24 = 192-bit, 32 = 256-bit). */
  public readonly keySize: number = -1;

  /** IV length in bytes (always 16 for AES). */
  public readonly ivSize: number = -1;

  /**
   * Encrypts a plaintext string.
   *
   * @param plaintext      - The text to encrypt.
   * @param key            - Encryption key as a hex string or Buffer.
   * @param iv             - Initialization vector as a hex string or Buffer.
   * @param outputEncoding - Encoding of the returned ciphertext. Default: `'base64'`.
   * @returns The encrypted string in the specified encoding.
   */
  public encrypt(plaintext: string, key: string|Buffer, iv: string|Buffer, outputEncoding: 'hex'|'binary'|'base64' = 'base64'): string {
    // Ensure key and IV are Buffers.
    if (!Buffer.isBuffer(key))
      key = Buffer.from(key);
    if (!Buffer.isBuffer(iv))
      iv = Buffer.from(iv);

    // Validate key and IV lengths.
    if (Buffer.byteLength(key) !== this.keySize)
      throw new Error(`Key length must be ${this.keySize} bytes long`);
    if (Buffer.byteLength(iv) !== this.ivSize)
      throw new Error(`IV length must be ${this.ivSize} bytes long`);

    // Encrypt and return the ciphertext.
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', outputEncoding);
    encrypted += cipher.final(outputEncoding);
    return encrypted;
  }

  /**
   * Decrypts an encrypted string back to plaintext.
   *
   * @param encrypted      - The encrypted string to decrypt.
   * @param key            - Encryption key used during encryption.
   * @param iv             - Initialization vector used during encryption.
   * @param inputEncoding  - Encoding of the input ciphertext. Default: `'base64'`.
   * @returns The decrypted plaintext string.
   */
  public decrypt(encrypted: string, key: string|Buffer, iv: string|Buffer, inputEncoding: 'hex'|'binary'|'base64' = 'base64'): string {
    // Ensure key and IV are Buffers.
    if (!Buffer.isBuffer(key))
      key = Buffer.from(key);
    if (!Buffer.isBuffer(iv))
      iv = Buffer.from(iv);

    // Validate key and IV lengths.
    if (Buffer.byteLength(key) !== this.keySize)
      throw new Error(`Key length must be ${this.keySize} bytes long`);
    if (Buffer.byteLength(iv) !== this.ivSize)
      throw new Error(`IV length must be ${this.ivSize} bytes long`);

    // Decrypt and return the plaintext.
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, inputEncoding, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Generates a random encryption key with the correct length for this algorithm.
   *
   * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
   * @returns A randomly generated encryption key.
   */
  public createKey(type: 'buffer'|'hex' = 'buffer'): Buffer|string {
    return type === 'hex'
      ? cryptoRandomString({length: this.keySize, type: 'hex'})
      : crypto.randomBytes(this.keySize);
  }

  /**
   * Generates a random initialization vector (IV).
   *
   * @param type - Return type: `'buffer'` for a Buffer, `'hex'` for a hex string. Default: `'buffer'`.
   * @returns A randomly generated IV.
   */
  public createIV(type: 'buffer'|'hex' = 'buffer'): Buffer|string {
    return type === 'hex'
      ? cryptoRandomString({length: this.ivSize, type: 'hex'})
      : crypto.randomBytes(this.ivSize);
  }
}
