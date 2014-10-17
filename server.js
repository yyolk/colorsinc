var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

var c;
var INTERVAL = 333;
// var color = function(){
//   c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";  
// }
app.use(function(req,res,next){
  // var color = function(){
    c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";  
  // }
  next();
});
app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
// var c;
var sirot = function() {
  return setInterval(function() {
    c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";
  }, INTERVAL);
}
var crot = sirot();
wss.on('connection', function(ws) {
    clearInterval(crot);
    crot = sirot();
    var id = setInterval(function() {
        ws.send(JSON.stringify(c));
    }, INTERVAL);

    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
    });
});
