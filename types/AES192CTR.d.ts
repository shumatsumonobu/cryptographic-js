import Cipher from '~/Cipher';
/**
 * AES-192-CTR cipher.
 * 192-bit key, 16-byte IV, Counter mode.
 */
export default class extends Cipher {
    readonly algorithm: string;
    readonly keySize: number;
    readonly ivSize: number;
}
