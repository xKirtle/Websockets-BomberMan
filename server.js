var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();
var server = app.listen(7777, () => {
    console.log('Listening to requests on port 7777');
});

//Socket setup
var io = socket(server);

//Static files
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New connection with the socket', socket.id);
    socket.on('socketConnection', (data) => {
        if (data == null) {
            socket.emit('promptName');
        }
    });

    socket.on('connection', (data) => {
        if (data != null) {
            socket.emit('generatePage');
        }
    });
});