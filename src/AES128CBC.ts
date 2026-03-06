import Cipher from '~/Cipher';

/**
 * AES-128-CBC cipher.
 * 128-bit key, 16-byte IV, Cipher Block Chaining mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-128-cbc';
  public readonly keySize: number = 16;
  public readonly ivSize: number = 16;
}
