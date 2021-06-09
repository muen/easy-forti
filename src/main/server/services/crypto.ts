/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import * as core from '@webcrypto-local/core';
import * as proto from '@webcrypto-local/proto';
import * as graphene from 'graphene-pk11';

import { Session } from '../../../@types/connection';
import { Server } from '../connection';

import { WebCryptoLocalError } from '../error';
import { CertificateStorageService } from './cert_storage';
import { KeyStorageService } from './key_storage';
import { ProviderService } from './provider';
import { Service } from './service';
import { SubtleService } from './subtle';

export interface CryptoNotifyEvent {
  type: 'pin';
  origin: string;
  label: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

export type CryptoNotifyEventHandler = (e: CryptoNotifyEvent) => void;

export class CryptoService extends Service<ProviderService> {
  constructor(server: Server, provider: ProviderService) {
    super(server, provider, [
      // #region List of actions
      proto.IsLoggedInActionProto,
      proto.LoginActionProto,
      proto.LogoutActionProto,
      proto.ResetActionProto,
      // #endregion
    ]);

    this.addService(new SubtleService(server, this));
    this.addService(new CertificateStorageService(server, this));
    this.addService(new KeyStorageService(server, this));
  }

  // #region Events

  public emit(event: 'notify', e: CryptoNotifyEvent): boolean;

  public emit(event: 'error', error: Error): boolean;

  public emit(event: 'info', level: core.LogLevel, source: string, message: string, data?: core.LogData): boolean;

  public emit(event: string, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  public on(event: 'notify', e: CryptoNotifyEventHandler): this;

  public on(event: 'error', cb: (error: Error) => void): this;

  public on(event: 'info', cb: core.LogHandler): this;

  public on(event: string, cb: (...args: any[]) => void): this {
    return super.on(event, cb);
  }

  public once(event: 'notify', e: CryptoNotifyEventHandler): this;

  public once(event: 'error', cb: (error: Error) => void): this;

  public once(event: 'info', cb: core.LogHandler): this;

  public once(event: string, cb: (...args: any[]) => void): this {
    return super.once(event, cb);
  }

  // #endregion

  public async getCrypto(id: string) {
    return this.object.getProvider().getCrypto(id);
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      case proto.IsLoggedInActionProto.ACTION: {
        const params = await proto.IsLoggedInActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log('info', 'crypto/isLoggedIn', {
          crypto: this.logCrypto(crypto),
        });

        result.data = new Uint8Array([crypto.isLoggedIn ? 1 : 0]).buffer;
        break;
      }
      case proto.LoginActionProto.ACTION: {
        const params = await proto.LoginActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log('info', 'crypto/login', {
          crypto: this.logCrypto(crypto),
        });

        const { slot } = crypto as any;

        if (crypto.login) {
          const token = slot.getToken();
          if (token.flags & graphene.TokenFlag.LOGIN_REQUIRED) {
            if (token.flags & graphene.TokenFlag.PROTECTED_AUTHENTICATION_PATH) {
              crypto.login('');
            } else {
              // show prompt
              const promise = new Promise<string>((resolve, reject) => {
                // @ts-ignore
                this.emit('notify', {
                  type: 'pin',
                  origin: 'test', // session.origin,
                  label: slot.getToken().label,
                  resolve,
                  reject,
                });
              });
              const pin = await promise;
              crypto.login(pin);
            }
          }
        }
        break;
      }
      case proto.LogoutActionProto.ACTION: {
        const params = await proto.LogoutActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);

        this.log('info', 'crypto/logout', {
          crypto: this.logCrypto(crypto),
        });

        if (crypto.logout) {
          crypto.logout();
        }
        break;
      }
      case proto.ResetActionProto.ACTION: {
        const params = await proto.ResetActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log('info', 'crypto/reset', {
          crypto: this.logCrypto(crypto),
        });

        if ('reset' in crypto) {
          // node-webcrypto-p11 has reset method
          await (crypto as any).reset();
        }
        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }

    return result;
  }
}
