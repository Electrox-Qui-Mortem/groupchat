// server.js
// where your node app starts

// init project
const express = require('express');
var http = require('http');
const app = express();
var server = http.Server(app);
var port = process.env.PORT || 5000;
var socketIO = require('socket.io');
var io = socketIO(server);
var mLab = require('mongolab-data-api')('Dj_EgiY8b-yLObrNAeln-AsCghwhVl_y');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
var recentlySent = new Map()
io.on('connection', function(socket) {
    var opt = {
        database:'lexybase',
        collectionName:'chat-history'
    }
    var list = []
    mLab.listDocuments(opt, (err, msgs) => {
        msgs.forEach((msg) => {
            list.push({
                usr:msg.usr,
                msg:msg.msg
            })
        })
    })
    socket.emit('chat messages', list)
    socket.on('chat message', (msg) => {
        var options = {
            database:'lexybase',
            collectionName:'chat-history',
            documents:msg
        }
        if(recentlySent.get(msg.usr) > 5) return socket.emit('spam')
        io.emit('chat message', msg)
        mLab.insertDocuments(options, () => {})
    })
  
    socket.on('log', console.log)
})
// listen for requests :)
server.listen(
    process.env.PORT,
    function() {
        console.log('Your app is listening on port ' + server.address().port);
    }
)
