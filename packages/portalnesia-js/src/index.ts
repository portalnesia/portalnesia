/**
 * @module
 * Portalnesia Client API
 */
 import { PortalnesiaOptions } from "@src/api/base";
 import {Portalnesia} from '@api/base'
 import OAuth from "@src/api/oauth";

export * from '@api/base'

/**
 * Portalnesia Client Instance
 * @class Portalnesia
 */
class Client extends Portalnesia {
  readonly oauth: OAuth
/**
 * @constructor
 * @param options {@link PortalnesiaOptions | Portalnesia Options}
 */
  constructor(options: PortalnesiaOptions) {
    super(options)
    this.oauth = new OAuth(this);
  }
}

export default Client;