var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require("express");
var httpProxy = require('http-proxy');
var path = require('path');
var Agent = https.Agent;
var forceSSL = require('express-force-ssl');

//
// Create your proxy server and set the target in the options.
//
var credentials = {
  key: fs.readFileSync(path.resolve(__dirname, 'ssl_cert', 'siri-api-key.pem'), 'utf8'),
  cert: fs.readFileSync(path.resolve(__dirname, 'ssl_cert', 'siri-api-cert.pem'), 'utf8')
};

// console.log(options);
var proxy = httpProxy.createProxyServer({
    // target: "https://localhost:4443/",
    target: {
      https: true,
      host: 'localhost',
      port: 4443,
      rejectUnauthorized: false
    },
    ssl: credentials,
    secure: false,
    xfwd: true,
    agent: new Agent({ maxSockets: Infinity })
  }).listen(9000);

//
// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  console.log(err);

  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Listen for the `proxyRes` event on `proxy`.
//
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('proxyRes');
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});


//
// Create your target server
//
var app = express();
app.use(forceSSL);

app.get('/proxy.pac', function(req, res) {
  console.log('proxy.pac');
  res.sendFile(path.resolve(__dirname, 'proxy.pac'));
});

app.use('*', function (req, res) {
  // console.log(req);
  console.log(req.url, req.params);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
});


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, "0.0.0.0", function() {
  console.log("Listening for HTTP");
});
httpsServer.listen(4443, "0.0.0.0", function() {
  console.log("Listening for HTTPS");
});
