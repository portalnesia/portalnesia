const http = require('http');
const fs = require('fs');
const nodePath = require('path');
const ejs = require('ejs');

const server = http.createServer(async function(req,res){
  const fullUrl = `http://localhost${req.url}`

  if(req.url === '/' || req.url.startsWith('/?')) {
    res.writeHead(200,{'Content-type':'text/html'})
    const url = new URL(fullUrl);
    
    let output='Click button on the left to show the output here'

    if(url.search.length > 0) {
      output={};
      const params = url.searchParams;
      params.forEach((value,key)=>{
        output[key]=value;
      })
      output = JSON.stringify(output,undefined,2);
    }
    const filePath = nodePath.resolve(`./browser/index.ejs`);
    const html = await ejs.renderFile(filePath,{output})
    res.write(html);
    res.end();
  } 
  /*else if(req.url === '/callback') {

  }*/
  else if(req.url.startsWith('/portalnesia') || req.url.startsWith('/pn-')) {
    const file = await fs.promises.readFile(__dirname+'/node_modules/@portalnesia/portalnesia-js/dist/umd'+req.url);
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