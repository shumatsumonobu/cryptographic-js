import Cipher from '~/Cipher';
/**
 * AES-128-CTR cipher.
 * 128-bit key, 16-byte IV, Counter mode.
 */
export default class extends Cipher {
    readonly algorithm: string;
    readonly keySize: number;
    readonly ivSize: number;
}
