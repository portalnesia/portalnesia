const Portalnesia = require('@portalnesia/portalnesia-js').default
const PortalnesiaServer = require('@portalnesia/portalnesia-js/server').default
const config = require('./config.json');

const portalnesia = new Portalnesia(config);
console.log(portalnesia.oauth.getAuthorizationUrl({scope:['aa','bb','cc'],state:'state'}))