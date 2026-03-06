import Cipher from '~/Cipher';
/**
 * AES-128-CBC cipher.
 * 128-bit key, 16-byte IV, Cipher Block Chaining mode.
 */
export default class extends Cipher {
    readonly algorithm: string;
    readonly keySize: number;
    readonly ivSize: number;
}
