import Cipher from '~/Cipher';

/**
 * AES-128-CTR cipher.
 * 128-bit key, 16-byte IV, Counter mode.
 */
export default class extends Cipher {
  public readonly algorithm: string = 'aes-128-ctr';
  public readonly keySize: number = 16;
  public readonly ivSize: number = 16;
}
