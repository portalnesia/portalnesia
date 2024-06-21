var authBtn = document.getElementById('auth-btn');
var output = document.getElementById('output');
var resetBtn = document.getElementById('reset-btn');
var copyBtn = document.getElementById('copy-btn');
var tokenBtn = document.getElementById('token-btn');
var setTokenBtn = document.getElementById('set-token-btn');
var blogListBtn = document.getElementById('blog-list-btn')
var refreshToken = document.getElementById('refresh-token');
var openIdBtn = document.getElementById('openid-btn');
var revokeToken = document.getElementById('revoke-token');
var blogDetailBtn = document.getElementById('blog-detail-btn')

var portalnesia = new Portalnesia(portalnesiaConfig)
var TBlog = new PNBlog(portalnesia);
let saved={};

function disabled() {
  document.querySelectorAll('main-portalnesia button').forEach(a=>{
    a.classList.add('disabled');
  })
}
function enabled() {
  document.querySelectorAll('main-portalnesia button').forEach(a=>{
    a.classList.remove('disabled');
  })
}
function copy() {
  try {
    output.select();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNode(output);
    if(sel!==null) {
      sel.removeAllRanges();
      sel.addRange(range);
      if(document.execCommand('copy')){
        alert("Copied!")
      }
    }
  } catch(e) {
    alert(e.message);
  }
}
copyBtn.addEventListener('click',copy)

authBtn.addEventListener('click',function(){
  var code = portalnesia.oauth.generatePKCE();
  saved.code_verifier = code.code_verifier;
  var authUrl = portalnesia.oauth.getAuthorizationUrl({scope:portalnesiaConfig['scope_approved'],state:'samplestate',code_challenge:code.code_challenge});
  output.value = authUrl
})

setTokenBtn.addEventListener('click',async function(){
  var token = window.prompt("Enter token object from your saved token...")
  try {
    if(token.length === 0) throw new Error('Token is not defined')
    token = JSON.parse(token);
    if(!token?.access_token && !token?.refresh_token) {
      throw new Error("Invalid token object")
    }
    portalnesia.oauth.setToken('authorization_code',token);
    document.querySelectorAll('div.category button.disabled').forEach(a=>{
      a.classList.remove('disabled');
    })
    document.querySelectorAll('button.oauth.disabled').forEach(a=>{
      a.classList.remove('disabled');
    })
    if(portalnesiaConfig.scope_approved.indexOf('openid') > -1 && token.id_token) {
      document.querySelectorAll('button#openid-btn.disabled').forEach(a=>{
        a.classList.remove('disabled');
      })
    }
    output.value = JSON.stringify(token,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  }
})

tokenBtn.addEventListener('click',async function(){
  var code = window.prompt("Enter code from output...")
  try {
    disabled();
    if(code.length === 0) throw new Error('Code is not defined')
    const token = await portalnesia.oauth.getToken({
      code_verifier:saved.code_verifier,
      scopes:portalnesiaConfig['scope_approved'],
      code,
      grant_type:'authorization_code'
    })
    delete saved.code_verifier;
    document.querySelectorAll('div.category button.disabled').forEach(a=>{
      a.classList.remove('disabled');
    })
    document.querySelectorAll('button.oauth.disabled').forEach(a=>{
      a.classList.remove('disabled');
    })
    if(portalnesiaConfig.scope_approved.indexOf('openid') > -1 && token.id_token) {
      document.querySelectorAll('button#openid-btn.disabled').forEach(a=>{
        a.classList.remove('disabled');
      })
    }
    output.value = JSON.stringify(token,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

openIdBtn.addEventListener('click',async function() {
  try {
    disabled();
    var token = portalnesia.tokens;
    console.log(token);
    if(!token.token.id_token) throw new Error('Token not contain id_token');

    var user = await portalnesia.oauth.verifyIdToken(token.token.id_token);
    output.value = JSON.stringify(user,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

refreshToken.addEventListener('click',async function() {
  try {
    disabled();
    var token = await portalnesia.oauth.refreshToken();
    output.value = JSON.stringify(token,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

revokeToken.addEventListener('click',async function() {
  try {
    disabled();
    await portalnesia.oauth.revokeToken();
    output.value = "Success";
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

blogListBtn.addEventListener('click',async function(){
  try {
    disabled();
    var blog = await TBlog.getAllBlog(1);
    output.value = JSON.stringify(blog,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

blogDetailBtn.addEventListener('click',async function(){
  try {
    disabled();
    var slug = window.prompt("Slug of blog...")
    if(slug.length === 0) throw new Error('Slug is not defined')
    var blog = await TBlog.getBlog(slug);
    output.value = JSON.stringify(blog,undefined,2);
  } catch(e) {
    console.log(e)
    output.value = "Error: "+e.message+"\n\n" + (e.payload ? JSON.stringify(e.payload,undefined,2) : '');
  } finally {
    enabled();
  }
})

resetBtn.addEventListener('click',function(){
  output.value = ""
})