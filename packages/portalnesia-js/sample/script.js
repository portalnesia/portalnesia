const fs = require('fs');
const nodePath = require('path')

async function startServer() {
  const path = nodePath.resolve('./config.json');
  const dest = nodePath.resolve('./browser/public/config.js');
  if(!fs.existsSync(path)) {
    if(!fs.existsSync(nodePath.resolve('./config-sample.json'))) {
      throw new Error("Please create `config.json`!");
    } else {
      throw new Error("Please rename `config-sample.json` to `config.json`");
    }
  }

  const buffer = await fs.promises.readFile(path);
  const config_string = JSON.parse(buffer.toString());
  if(typeof config_string.client_secret !== 'undefined') delete config_string.client_secret;
  
  const config = `/*!
* @license Copyright (c) 2022, Portalnesia - Putu Aditya. All rights reserved.
*
* DO NOT EDIT THIS FILE. THIS FILE CREATED AUTOMATICALLY FROM YOUR CONFIG.JSON
*/

const portalnesiaConfig = ${JSON.stringify(config_string,undefined,2)}`;

  await fs.promises.writeFile(dest,config);
}

startServer();