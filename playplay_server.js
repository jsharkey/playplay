/*
 * Copyright (C) 2013 Jeff Sharkey
 * http://jsharkey.org/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cmds = ['playPause', 'nextTrack', 'prevTrack', 'volUp', 'volDown'];
var clients = [];
var fs = require('fs');
var http = require('https');

// Self-signed SSL certificates for an https server:
// http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server
// NOTE: Obviously you'll need to generate your own.
var options = {
    key: fs.readFileSync('./ssl-certificates/key.pem'),
    cert: fs.readFileSync('./ssl-certificates/cert.pem')
};

// https server listening for commands from host (e.g.,
// https://localhost:8076/playPause )
var server = http.createServer(options, function (req, res) {
    for (var i = 0; i < cmds.length; i++) {
        var cmd = cmds[i];
        if (req.url == '/' + cmd) {
            // valid command, relay along!
            for (var j = 0; j < clients.length; j++) {
                var ws = clients[j];
                ws.send(cmd, function() { });
            }

            var msg = 'relayed ' + cmd + ' to ' + clients.length + ' clients';
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(msg);
            console.log(msg);
            return;
        }
    }

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Server listening for commands.');
}).listen(8076, 'localhost'); // PL in ascii


// websocket server that playplay_client extension connects to on port 6589
// (6589 is AY in ascii).
var processRequest = function( req, res ) {
    res.writeHead(200);
    res.end("All glory to WebSockets!\n");
};

var server_listen = http.createServer(options, processRequest).listen(6589);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server_listen});
wss.on('connection', function(ws) {
    clients.push(ws);
    console.log('client connection; now ' + clients.length);

    ws.on('close', function() {
        clients.splice(clients.indexOf(ws), 1);
        console.log('client closed; now ' + clients.length);
    })
});
