import Cipher from '~/Cipher';

/**
 * AES-256-CTR cipher.
 * 256-bit key, 16-byte IV, Counter mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-256-ctr';
  public readonly keySize: number = 32;
  public readonly ivSize: number = 16;
}
