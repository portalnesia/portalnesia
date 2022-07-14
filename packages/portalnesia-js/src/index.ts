/**
 * @module
 * Portalnesia Client API
 */
 import {Portalnesia,PortalnesiaOptions} from './base'

export * from './base'
export * from './oauth'
export {default as PortalnesiaError} from './exception/PortalnesiaException'

/**
 * Portalnesia Client Instance
 * @class Portalnesia
 */
class Client extends Portalnesia {
/**
 * @constructor
 * @param options {@link PortalnesiaOptions | Portalnesia Options}
 */
  constructor(options: PortalnesiaOptions) {
    super(options)
  }
}

export default Client;