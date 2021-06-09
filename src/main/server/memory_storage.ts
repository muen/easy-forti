/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { ServiceCryptoItem } from './crypto_item';
import { WebCryptoLocalError } from './error';

export class MemoryStorage {
  public items: { [key: string]: ServiceCryptoItem } = {};

  public get length() {
    return Object.keys(this.items).length;
  }

  public item(id: string) {
    const result = this.items[id];
    if (!result) {
      throw new WebCryptoLocalError(WebCryptoLocalError.CODE.MEMORY_STORAGE_OUT_OF_INDEX, `Cannot get crypto item by ID '${id}'`);
    }

    return result;
  }

  public hasItem(param: string | ServiceCryptoItem) {
    if (param instanceof ServiceCryptoItem) {
      return !!this.items[param.id];
    }

    return !!this.items[param];
  }

  public add(item: ServiceCryptoItem) {
    this.items[item.id] = item;
  }

  public remove(param: string | ServiceCryptoItem) {
    if (param instanceof ServiceCryptoItem) {
      delete this.items[param.id];
    } else {
      delete this.items[param];
    }
  }

  public removeAll() {
    this.items = {};
  }

  public removeByProvider(providerID: string) {
    const IDs = [];
    for (const id in this.items) {
      const item = this.items[id];
      if (item.providerID === providerID) {
        IDs.push(id);
      }
    }
    IDs.forEach((id) => {
      this.remove(id);
    });
  }
}
