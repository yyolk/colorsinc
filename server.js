var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;
var participants=0;
var c = [];
var INTERVAL = 6853;
var REMAINING = 0;
// var color = function(){
//   c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";  
// }
var rotate = function() {
  for (var i=0;i<3;i++) {
    c[i] = Math.floor(Math.random()*255);
  }
}
rotate();
var remaining_time = function() {
  return setInterval(function(){
    REMAINING = (INTERVAL - REMAINING - 5) <0 ? INTERVAL - 5 + (INTERVAL - REMAINING - 5) : (INTERVAL - REMAINING - 5);
  }, 5);
}
var sirot = function() {
  return setInterval(function() {
    rotate();
  }, INTERVAL);
}
app.use(function(req,res,next){
  // var color = function(){
    // c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";  
  // }
  sirot();
  next();
});
app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
// var c;
var crot = sirot();
var sc = function(ws){
  var r = c[0], g = c[1], b = c[2];
  ws.send(JSON.stringify({
    r: r,
    g: g,
    b: b,
    p: participants,
    ir: REMAINING,
    i: INTERVAL
  }));
}
wss.on('connection', function(ws) {
    participants++;
    var ccrot = function(){
      clearInterval(crot);
      crot = sirot();      
    }
    ccrot();
    var id = setInterval(function() {
        sc(ws);
    }, INTERVAL/5);
    sc(ws);

    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
    });
    ws.on('message', function(message){
        console.log('interrupt!');
        ccrot();
        c = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";
        sc(ws);
    });
});

