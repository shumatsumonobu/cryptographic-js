import Cipher from '~/Cipher';

/**
 * AES-192-CTR cipher.
 * 192-bit key, 16-byte IV, Counter mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-192-ctr';
  public readonly keySize: number = 24;
  public readonly ivSize: number = 16;
}
