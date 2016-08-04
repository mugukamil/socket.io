// create an http server
var http = require('http');

// read and write files
var fs = require('fs');

// compile ejs templates
var ejs = require('ejs');

// Compile and return an html, css or javascript file using ejs.
function render (file, data) {
  var source = fs.readFileSync(`app/${file}`, 'utf8');
  var template = ejs.compile(source);
  return template(data);
}

// The global count variable.
var count = 0;

// The main application function.
function app (req, res) {
  // A simple route in the form: "GET /url".
  var route = `${req.method} ${req.url}`;

  // A very sophisticated router implemented as a switch statement :-).
  switch (route) {

    // Send the home page!
    case 'GET /':
      var content = render('app.html', {count: count++});
      res.writeHead(200, 'Ok', {'Content-Type': 'text/html'});
      res.end(content);
      break;

    // Send the javascript!
    case 'GET /app.js':
      var content = render('app.js');
      res.writeHead(200, 'Ok', {'Content-Type': 'application/javascript'});
      res.end(content);
      break;

    // Send back some json for the ajax request! You could also send back html
    // or any text you want!
    case 'GET /ajax':
      var json = JSON.stringify({count: count++});
      res.writeHead(200, 'Ok', {'Content-Type': 'application/json'});
      res.end(json);
      break;

    // uh oh must have been a bad route :-(
    default:
      res.writeHead(404, 'Not Found');
      res.end();

  }
}

// Create the http server.
var server = http.createServer(app);

// Create the WebSocket server
var io = require('socket.io')(server);

// Respond to the WebSocket connection event
io.on('connection', function (socket) {
  console.log('a user connected');
});

// Send a new count to the browser every 2 seconds
setInterval(() => io.emit('count', count++), 2000);

// Kickoff time! Create the http server, grab some popcorn and listen on port
// 3000.
server.listen(3000);

// Always nice to give a friendly message so the user knows we're okay.
console.log('HTTP server listening on http://%s:%s', 'localhost', '3000');
