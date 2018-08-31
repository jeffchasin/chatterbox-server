var http = require('http');
var fs = require('fs');
var url = require('url');

// var test = require()

var handleRequest = require('./request-handler');

var port = 3000;

var ip = '127.0.0.1';

var server = http.createServer(function(req, res) {  

  if (req.url === '/' || url.parse(req.url).search) {

    res.writeHead(200, {'Content-Type': 'text/html'});

    fs.createReadStream(__dirname + '/../client/client/index.html', 'utf8').pipe(res);

    console.log('Home page fired');

  } else if (req.url === '/styles/styles.css') {

    res.writeHead(200, {'Content-Type': 'text/css'});

    fs.createReadStream(__dirname + '/../client/client/styles/styles.css', 'utf8').pipe(res);

    console.log('style sheet fired');

  } else if (req.url === '/lib/jquery.js') {

    res.writeHead(200, {'Content-Type': 'application/javascript'});

    fs.createReadStream(__dirname + '/../client/lib/jquery.js', 'utf8').pipe(res);

    console.log('jquery fired');

  } else if (req.url === '/scripts/app.js') {

    res.writeHead(200, {'Content-Type': 'application/javascript'});

    fs.createReadStream(__dirname + '/../client/client/scripts/app.js', 'utf8').pipe(res);

    console.log('app fired');

  } else if (req.url === '/images/lemon.svg') {

    res.writeHead(200, {'Content-Type': 'image/svg+xml'});

    fs.createReadStream(__dirname + '/../client/client/images/lemon.svg', 'utf8').pipe(res);

    console.log('lemon pic fired');

  } else if (req.url === '/classes/messages') {

    handleRequest.requestHandler(req, res);

    console.log('message handler fired');

  } else {

    res.writeHead(400, {'Content-Type': 'text/html'});

    fs.createReadStream(__dirname + '/404.html', 'utf8').pipe(res);

  }

});

console.log('Listening on http://' + ip + ':' + port);

server.listen(port, ip);


