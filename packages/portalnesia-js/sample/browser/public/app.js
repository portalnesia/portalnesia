var authBtn = document.getElementById('auth-btn');
var output = document.getElementById('output');
var resetBtn = document.getElementById('reset-btn');

var portalnesia = new Portalnesia({
  client_id:'abcdefghijklmn',
  redirect_uri:'http://localhost:8000/callback'
})

authBtn.addEventListener('click',function(){
  var authUrl = portalnesia.oauth.getAuthorizationUrl({scope:['basic','blog','openid'],state:'samplestate'});
  output.value = authUrl
})

resetBtn.addEventListener('click',function(){
  output.value = ""
})