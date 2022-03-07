/**
 * @module
 * Portalnesia Server API
*/
import { PortalnesiaOptions } from "@src/api/base";
import Blog from "./api/blog";
import {Portalnesia} from '@api/base'
import OAuth from "@src/api/oauth";

export * from '@api/base'
 
/**
* Portalnesia Server-Side Instance
* @class Portalnesia
*/
class Server extends Portalnesia {
 
  readonly blog: Blog
  readonly oauth: OAuth
  /**
  * @constructor
  * @param options {@link PortalnesiaOptions | Portalnesia Options}
  */
  constructor(options: PortalnesiaOptions) {
    super(options)
    this.blog = new Blog(this)
    this.oauth = new OAuth(this);
  }
}

export default Server;