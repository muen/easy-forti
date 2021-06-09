/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable import/no-cycle */
/**
 * NOTE: We are using PKCS#11 Subtle directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */
import { CryptoKey, SubtleCrypto } from 'node-webcrypto-p11';
import { Pkcs11Crypto } from './crypto';
import { fixObject, isOsslObject } from './helper';

export class Pkcs11SubtleCrypto extends SubtleCrypto {
  protected crypto!: Pkcs11Crypto;

  constructor(crypto: Pkcs11Crypto) {
    super(crypto);
  }

  public async importKey(format: any, keyData: any, algorithm: any, extractable: any, keyUsages: any) {
    let key: CryptoKey;
    try {
      key = await super.importKey(format, keyData, algorithm, extractable, keyUsages);
    } catch (err) {
      key = await this.crypto.ossl.subtle.importKey(format, keyData, algorithm, extractable, keyUsages);
      fixObject(this.crypto, key);
    }

    return key;
  }

  public async verify(algorithm: string | AesCmacParams | RsaPssParams | EcdsaParams, key: CryptoKey, signature: ArrayBuffer | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView, data: ArrayBuffer | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView) {
    if (!isOsslObject(key)) {
      return super.verify(algorithm, key, signature, data);
    }

    return this.crypto.ossl.subtle.verify(algorithm, key, signature, data);
  }
}
