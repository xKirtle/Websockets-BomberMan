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

    socket.on('disconnecting', () => {
        //Similar to leaveRoom except I need to go find which room the socket was on
        let rooms = Object.keys(socket.rooms);
        if (rooms[0] <= 3) {
            removePlayerFromRoom(rooms[0]);
        }
    });

    socket.on('joinRoom', (data) => {
        function createNewRoom(roomNumber, playerName) {
            let newRoom = {
                roomNumber: roomNumber,
                roomCount: 1,
                Players: {
                    List: [
                        {
                            PlayerName: '',
                            SocketId: ''
                        },
                        {
                            PlayerName: '',
                            SocketId: ''
                        },
                        {
                            PlayerName: '',
                            SocketId: ''
                        },
                        {
                            PlayerName: '',
                            SocketId: ''
                        }
                    ],
                    Red: [''],
                    Blue: [''],
                    Pink: [''],
                    Gray: ['']
                },
                Host: ''
            };
            let newPlayer = {
                PlayerName: playerName,
                SocketId: socket.id
            };
            newRoom.Players.List[0] = newPlayer;
            newRoom.Host = newPlayer;
            gameRooms.push(newRoom);
        }

        let duplicateIndex = findRoomByNumber(data.roomNumber);

        if (duplicateIndex >= 0 && gameRooms[duplicateIndex].roomCount < 4) {
            gameRooms[duplicateIndex].Players.List[gameRooms[duplicateIndex].roomCount] = {
                PlayerName: data.playerName,
                SocketId: socket.id
            };
            gameRooms[duplicateIndex].roomCount = gameRooms[duplicateIndex].roomCount + 1;
            socket.join(data.roomNumber);
            socket.emit('joinRoom');
            io.to(data.roomNumber).emit('updatePlayerCount', gameRooms[duplicateIndex].roomCount);

        } else if (typeof gameRooms[duplicateIndex] == 'undefined') {
            createNewRoom(data.roomNumber, data.playerName);
            socket.join(data.roomNumber);
            socket.emit('joinRoom');
            io.to(data.roomNumber).emit('updatePlayerCount', 1);
        }

        sortGameRooms();
        io.sockets.emit('updateLobbyRooms', gameRooms);
    });

    socket.on('leaveRoom', (roomNumber) => {
        removePlayerFromRoom(roomNumber);
    });

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

    function sortGameRooms() {
        gameRooms.sort((a, b) => {
            return a.roomNumber - b.roomNumber;
        });
    }

    function removePlayerFromRoom(roomNumber) {
        let duplicateIndex = findRoomByNumber(roomNumber);
        let room = gameRooms[duplicateIndex];

        if (room.Host.SocketId != socket.id) {
            for (let index = 0; index < room.roomCount; index++) {
                if (room.Players.List[index].SocketId == socket.id) {
                    room.Players.List.splice(index, 1);
                    //remove char selection of the removed player
                    break;
                }
            }
        } else {
            room.Players.List.splice(0, 1);
            //remove char selection of the host
            room.Host = room.Players.List[0];
        }
        socket.leave(roomNumber);
        socket.emit('leaveRoom');
        gameRooms[duplicateIndex].roomCount -= 1;

        if (room.roomCount == 0) {
            gameRooms.splice(duplicateIndex, 1);
        } else {
            io.to(roomNumber).emit('updatePlayerCount', gameRooms[duplicateIndex].roomCount);
        }

        sortGameRooms();
        io.sockets.emit('updateLobbyRooms', gameRooms);
    }
});