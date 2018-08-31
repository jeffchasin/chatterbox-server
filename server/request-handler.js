
const uuidv4 = require('uuid/v4');
const fs = require('fs');

/*************************************************************
You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};
// var messages = {
//   results: []
// };

var statusCode;

var requestHandler = function(request, response) {

  if (request.url === '/classes/messages') {

    if (request.method.toUpperCase() === 'OPTIONS') {

      response.writeHead(
        '200',
        'No Content',
        {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, accept',
          'access-control-max-age': 10, // Seconds.
          'content-length': 0,
          
        }
      );
      response.end();
    }

    if (request.method === 'GET') {

      var messageFile = fs.readFileSync(__dirname + '/messages.txt', 'utf8');

      statusCode = 200;

      response.writeHead(statusCode, defaultCorsHeaders);

      var results = '"results":[' + messageFile + ']';

      var messages = '{' + results + '}';

      var parsedMessages = JSON.parse(messages);

      parsedMessages.results.reverse();

      response.end(JSON.stringify(parsedMessages));

    } else if (request.method === 'POST') {

      var rawData = ''; 

      request.on('data', (chunk) => {

        rawData += chunk;

      }).on('end', () => {

        var parsedData = JSON.parse(rawData);

        parsedData.objectId = uuidv4();
        
        var messageFile = fs.readFileSync(__dirname + '/messages.txt', 'utf8');

        if (messageFile.length === 0) {

          var comma = '';

        } else {

          var comma = ',';

        }

        fs.appendFile(__dirname + '/messages.txt', comma + rawData, function(err, data) {

          statusCode = 201;
          
          response.writeHead(statusCode, defaultCorsHeaders);
          
          response.end();

        });

      });
    } 
  
  } else {
    statusCode = 404;
    response.writeHead(statusCode, defaultCorsHeaders);
    response.end(JSON.stringify(messages));
  }
};

module.exports = {
  requestHandler
};

// Request and Response come from node's http module.
//  headers['Content-Type'] = 'text/plain';
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// See the note below about CORS headers.


// Tell the client we are sending them plain text.
// headers['Content-Type'] = 'text/plain';
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.


// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.