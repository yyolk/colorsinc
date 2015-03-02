var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;
var c = [];
var INTERVAL = 6853;
var REMAINING = 0;

var rotate = function() {
  for (var i=0;i<3;i++) {
    c[i] = Math.floor(Math.random()*255);
  }
}
rotate();
var sirot = (function(){
  setInterval(function() {
      rotate();
  }, INTERVAL);
})();
var remaining_time = (function() {
  var sync = INTERVAL / 6;
  var sr = 0;
  return setInterval(function(){
    sr = sr + sync < INTERVAL ? sr + sync : 0;
    sr = Math.floor(sr);
    REMAINING = INTERVAL - sr;
  }, sync);
})();

// var sirot = function() {
//   return setInterval(function() {
//     rotate();
//   }, INTERVAL);
// }
// sirot();

app.use(function(req,res,next){
  // sirot();
  next();
});

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
var sc = function(wss){
  var r = c[0], g = c[1], b = c[2];
  data = {
    r: r,
    g: g,
    b: b,
    p: wss.clients.length,
    ir: REMAINING,
    i: INTERVAL
  }
  wss.broadcast(data);
}
wss.on('connection', function(ws) {
    var id = setInterval(function() {
      sc(wss);
    }, INTERVAL/5);

    sc(wss);

    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
        clearInterval(id);
    });
    ws.on('message', function(message){
        console.log('interrupt!');
        rotate();
        sc(wss);
    });
});
