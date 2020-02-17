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
var gameRooms = [];

io.on('connection', (socket) => {
    console.log('New connection with the socket', socket.id);
    socket.on('socketConnection', (data) => {
        if (data == null) {
            socket.emit('promptName');
        }
    });

    socket.on('connection', (data) => {
        if (data != null) {
            socket.emit('generatePage', gameRooms);
        }
    });

    socket.on('joinRoom', (data) => {
        function findRoomByNumber(roomNumber) {
            let duplicate = false;
            let duplicateIndex;
            for (let i = 0; i < gameRooms.length; i++) {
                if (gameRooms[i].roomNumber == roomNumber) {
                    duplicate = true;
                    duplicateIndex = i;
                    break;
                }
            }

            if (duplicate) {
                return duplicateIndex;
            } else {
                return -1;
            }
        }

        function createNewRoom(roomNumber, playerName) {
            let newRoom = {
                roomNumber: roomNumber,
                roomCount: '1',
                Players: {
                    Red: ['', ''],
                    Blue: ['', ''],
                    Pink: ['', ''],
                    Gray: ['', '']
                },
                Host: playerName
            };
            //order game rooms by roomNumber
            gameRooms.push(newRoom);
        }

        let duplicateIndex = findRoomByNumber(data.roomNumber);

        if (duplicateIndex >= 0) {
            gameRooms[duplicateIndex].roomCount = parseInt(gameRooms[duplicateIndex].roomCount) + 1;
            socket.join(data.roomNumber);
            socket.emit('joinRoom');
            io.to(data.roomNumber).emit('updatePlayerCount', gameRooms[duplicateIndex].roomCount);
            io.sockets.emit('updateLobbyRooms', gameRooms);

        } else {
            createNewRoom(data.roomNumber, data.playerName);
            socket.join(data.roomNumber);
            socket.emit('joinRoom');
            io.to(data.roomNumber).emit('updatePlayerCount', 1);
            io.sockets.emit('updateLobbyRooms', gameRooms);
        }
    });
});