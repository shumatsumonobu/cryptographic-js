import Cipher from '~/Cipher';

/**
 * AES-256-CFB cipher.
 * 256-bit key, 16-byte IV, Cipher Feedback mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-256-cfb';
  public readonly keySize: number = 32;
  public readonly ivSize: number = 16;
}
