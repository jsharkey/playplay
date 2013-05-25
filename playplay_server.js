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


// server listening for commands from host
var http = require('http');
var server = http.createServer(function (req, res) {
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
    res.end('nope');
}).listen(8076, 'localhost'); // PL in ascii


// websocket that music app connects to
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: 'localhost', port: 6589}); // AY in ascii
wss.on('connection', function(ws) {
    clients.push(ws);
    console.log('client connection; now ' + clients.length);

    ws.on('close', function() {
        clients.splice(clients.indexOf(ws), 1);
        console.log('client closed; now ' + clients.length);
    })
});
