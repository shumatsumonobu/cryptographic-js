import Cipher from '~/Cipher';

/**
 * AES-256-CBC cipher.
 * 256-bit key, 16-byte IV, Cipher Block Chaining mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-256-cbc';
  public readonly keySize: number = 32;
  public readonly ivSize: number = 16;
}
