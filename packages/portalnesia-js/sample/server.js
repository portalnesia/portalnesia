const Portalnesia = require('@portalnesia/portalnesia-js').default
//const PortalnesiaServer = require('@portalnesia/portalnesia-js/server').default
const config = require('./config.json');

const portalnesia = new Portalnesia(config);
console.log(portalnesia.oauth.getAuthorizationUrl({scope:config['scope_approved'],state:'samplestate'}))

const http = require('http');

const server = http.createServer(async function(req,res){
  const fullUrl = `http://localhost${req.url}`
  if(req.url === '/' || req.url.startsWith('/?')) {
    res.writeHead(200,{'Content-type':'application/json'})
    const url = new URL(fullUrl);
    const params = url.searchParams;
    let error=undefined,code=undefined;
    if(params.has('error')) error = params.get('error')
    else if(params.has('code')) code = params.get('code');
    if(code) console.log("SAVE THIS CODE TO YOUR CONFIG.JSON");
    console.log({error,code});
    res.write(JSON.stringify({error,code}));
    res.end();
    await getToken(code)
  }
})
server.listen(8000,undefined,undefined,function() {
  console.log("Server is running on port 8000")
});

function main() {
  if(config.grant_type && config.grant_type.length > 0 && config.token && config.token.access_token && config.token.access_token.length > 0) {
    portalnesia.oauth.setToken(config.grant_type,config.token);
  }
}

async function getToken(code) {
  try {
    const token = await portalnesia.oauth.getToken({
      scopes:config.scope_approved,
      code,
      grant_type:'authorization_code'
    })
    console.log("SAVE THIS TOKEN TO YOUR CONFIG.JSON");
    console.log(token)
  } catch(e) {
    console.log(e)
  }
}

