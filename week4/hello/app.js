var msg = "Hello World";
console.log(msg);

let http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/html"});// if good (hhtp 200), make msg
    res.end('Hello from node server');//write to server response
}).listen(8080);//listen on port 8080