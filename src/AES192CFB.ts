import Cipher from '~/Cipher';

/**
 * AES-192-CFB cipher.
 * 192-bit key, 16-byte IV, Cipher Feedback mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-192-cfb';
  public readonly keySize: number = 24;
  public readonly ivSize: number = 16;
}
