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
  'access-control-max-age': 10 // Seconds.
};

var messages = {
  results: [{
    username: 'Jono',
    text: 'Do my bidding!'
  }]
};

var requestHandler = function (request, response) {

  var statusCode;

  var headers = defaultCorsHeaders;

  // headers['Content-Type'] = 'text/plain';
  headers['Content-Type'] = 'application/json';

  if (request.url === '/classes/messages') {
    // var origin = (request.headers.origin || '*');

    if (request.method.toUpperCase() === 'OPTIONS') {

      response.writeHead(
        '200',
        'No Content',
        {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'access-control-allow-headers': 'content-type, accept',
          'access-control-max-age': 10, // Seconds.
          'content-length': 0
        }
      );
      response.end();
      // ?????????
      // return (response.end());
    }


    if (request.method.toUpperCase() === 'GET') {
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));

    } else if (request.method.toUpperCase() === 'POST') {
      statusCode = 201;

      var rawData = '';

      request.on('data', (data) => {
        rawData += data;
      }).on('end', () => {
        messages.results.push(JSON.parse(rawData));
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(messages));
        console.log('rawData: ', rawData);
        console.log('messages', messages);
      });


      console.log('Serving request type ' + request.method + ' for url ' + request.url);
    }

  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages));
  }
};

module.exports = {
  requestHandler
};
