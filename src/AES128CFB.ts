import Cipher from '~/Cipher';

/**
 * AES-128-CFB cipher.
 * 128-bit key, 16-byte IV, Cipher Feedback mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-128-cfb';
  public readonly keySize: number = 16;
  public readonly ivSize: number = 16;
}
