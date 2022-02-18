const http = require('http');
const fs = require('fs');
const nodePath = require('path');

const server = http.createServer(async function(req,res){
  if(req.url === '/') {
    res.writeHead(200,{'Content-type':'text/html'})
    const html = await fs.promises.readFile(nodePath.resolve('./browser/index.html'));
    res.write(html);
    res.end();
  } 
  /*else if(req.url === '/callback') {

  }*/
  else if(req.url === '/Portalnesia.min.js') {
    const file = await fs.promises.readFile(__dirname+'/node_modules/@portalnesia/portalnesia-js/dist/umd/Portalnesia.min.js');
    res.writeHead(200,{'Content-type':'text/javascript','Cache-Control':'no-cache'});
    res.end(file);
  }
  else {
    try {
      const file = await fs.promises.readFile(__dirname+'/browser/public'+req.url);
      const ext = nodePath.extname(__dirname+'/browser/public'+req.url);
      const mime = {
        '.js':'text/javascript',
        '.css':'text/css'
      }
      res.writeHead(200,{'Content-type':mime?.[ext]||'text/plain','Cache-Control':'no-cache'});
      res.end(file);
    } catch(e) {
      res.writeHead(400,{'Content-type':'application/json'})
      res.write(JSON.stringify({error:404,message:"Not found"},undefined,2));
      res.end();
    }
    
  }
})
server.listen(8000,undefined,undefined,function() {
  console.log("Server is running on port 8000")
});