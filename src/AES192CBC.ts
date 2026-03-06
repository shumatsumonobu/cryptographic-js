import Cipher from '~/Cipher';

/**
 * AES-192-CBC cipher.
 * 192-bit key, 16-byte IV, Cipher Block Chaining mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-192-cbc';
  public readonly keySize: number = 24;
  public readonly ivSize: number = 16;
}
