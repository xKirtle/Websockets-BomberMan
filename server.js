var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();
var server = app.listen(80, () => {
    console.log('Listening to requests on port 80');
});

//Socket setup
var io = socket(server);

//Static files
app.use(express.static('public'));
var gameRooms = [];

io.on('connection', (socket) => {
    console.log('Default:', socket.id);
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
                readyCount: 0,
                Players: {
                    List: [
                        {
                            PlayerName: '',
                            SocketId: '',
                            Color: '',
                            Ready: false
                        },
                        {
                            PlayerName: '',
                            SocketId: '',
                            Color: '',
                            Ready: false
                        },
                        {
                            PlayerName: '',
                            SocketId: '',
                            Color: '',
                            Ready: false
                        },
                        {
                            PlayerName: '',
                            SocketId: '',
                            Color: '',
                            Ready: false
                        }
                    ],
                    Blue: '',
                    Black: '',
                    Green: '',
                    Yellow: ''
                },
                Host: ''
            };
            let newPlayer = {
                PlayerName: playerName,
                SocketId: socket.id,
                Color: '',
                Ready: false
            };
            newRoom.Players.List[0] = newPlayer;
            newRoom.Host = newPlayer;
            gameRooms.push(newRoom);
        }

        let roomIndex = findRoomByNumber(data.roomNumber);

        if (roomIndex >= 0 && gameRooms[roomIndex].roomCount < 4) {
            gameRooms[roomIndex].Players.List[gameRooms[roomIndex].roomCount] = {
                PlayerName: data.playerName,
                SocketId: socket.id,
                Color: '',
                Ready: false
            };
            gameRooms[roomIndex].roomCount = gameRooms[roomIndex].roomCount + 1;
            socket.join(data.roomNumber);
            socket.emit('joinRoom', gameRooms[roomIndex]);

            io.to(data.roomNumber).emit('updatePlayerList', gameRooms[roomIndex].Players.List);
            io.to(data.roomNumber).emit('updateReadyCount', gameRooms[roomIndex].readyCount);
            io.to(data.roomNumber).emit('updateSelectedCharacters', gameRooms[roomIndex]);

        } else if (typeof gameRooms[roomIndex] == 'undefined') {
            createNewRoom(data.roomNumber, data.playerName);
            let roomIndex = findRoomByNumber(data.roomNumber);
            socket.join(data.roomNumber);
            socket.emit('joinRoom', gameRooms[roomIndex]);
            io.to(data.roomNumber).emit('updatePlayerList', gameRooms[roomIndex].Players.List);
        }

        sortGameRooms();
        io.sockets.emit('updateLobbyRooms', gameRooms);
    });

    socket.on('leaveRoom', (roomNumber) => {
        removePlayerFromRoom(roomNumber);
    });

    socket.on('requestCharacter', (data) => {
        let roomIndex = findRoomByNumber(data.roomNumber);
        let colorChanged = null;

        switch (data.color) {
            case 'blue':
                if (gameRooms[roomIndex].Players.Blue == '') {
                    cleanLastColor(roomIndex);
                    gameRooms[roomIndex].Players.Blue = socket.id
                    colorChanged = 'blue';
                }
                break;
            case 'black':
                if (gameRooms[roomIndex].Players.Black == '') {
                    cleanLastColor(roomIndex);
                    gameRooms[roomIndex].Players.Black = socket.id;
                    colorChanged = 'black';
                }
                break;
            case 'green':
                if (gameRooms[roomIndex].Players.Green == '') {
                    cleanLastColor(roomIndex);
                    gameRooms[roomIndex].Players.Green = socket.id;
                    colorChanged = 'green';
                }
                break;
            case 'yellow':
                if (gameRooms[roomIndex].Players.Yellow == '') {
                    cleanLastColor(roomIndex);
                    gameRooms[roomIndex].Players.Yellow = socket.id;
                    colorChanged = 'yellow';
                }
                break;
        }

        for (let index = 0; index < 4; index++) {
            if (colorChanged != null && gameRooms[roomIndex].Players.List[index].SocketId == socket.id) {
                gameRooms[roomIndex].Players.List[index].Color = colorChanged;

                if (gameRooms[roomIndex].Players.List[index].Ready == true) {
                    gameRooms[roomIndex].Players.List[index].Ready = false;
                    gameRooms[roomIndex].readyCount -= 1;
                }
                break;
            }
        }

        io.to(data.roomNumber).emit('updateSelectedCharacters', gameRooms[roomIndex]);
        io.to(data.roomNumber).emit('updateReadyCount', gameRooms[roomIndex].readyCount);
        socket.emit('changedCharacter', colorChanged);
    });

    socket.on('playerReady', (data) => {
        let roomIndex = findRoomByNumber(data.roomNumber);
        for (let index = 0; index < 4; index++) {
            if (gameRooms[roomIndex].Players.List[index].Color == data.Color && gameRooms[roomIndex].Players.List[index].Ready != true) {
                gameRooms[roomIndex].Players.List[index].Ready = true;
                gameRooms[roomIndex].readyCount += 1;
                break;
            }
        }

        io.sockets.emit('updateLobbyRooms', gameRooms);
        io.to(data.roomNumber).emit('updateReadyCount', gameRooms[roomIndex].readyCount);
    });

    function findRoomByNumber(roomNumber) {
        let duplicate = false;
        let roomIndex;
        for (let i = 0; i < gameRooms.length; i++) {
            if (gameRooms[i].roomNumber == roomNumber) {
                duplicate = true;
                roomIndex = i;
                break;
            }
        }

        if (duplicate) {
            return roomIndex;
        } else {
            return -1;
        }
    }

    function sortGameRooms() {
        gameRooms.sort((a, b) => {
            return a.roomNumber - b.roomNumber;
        });
    }

    function cleanLastColor(roomIndex) {
        if (gameRooms[roomIndex].Players.Blue == socket.id) {
            gameRooms[roomIndex].Players.Blue = '';
        }

        if (gameRooms[roomIndex].Players.Black == socket.id) {
            gameRooms[roomIndex].Players.Black = '';
        }

        if (gameRooms[roomIndex].Players.Green == socket.id) {
            gameRooms[roomIndex].Players.Green = '';
        }

        if (gameRooms[roomIndex].Players.Yellow == socket.id) {
            gameRooms[roomIndex].Players.Yellow = '';
        }
    }

    function removePlayerFromRoom(roomNumber) {
        let roomIndex = findRoomByNumber(roomNumber);
        let room = gameRooms[roomIndex];

        if (room.Host.SocketId != socket.id) {
            for (let index = 0; index < room.roomCount; index++) {
                if (room.Players.List[index].SocketId == socket.id) {
                    cleanLastColor(roomIndex);
                    if (room.Players.List[index].Ready == true) {
                        room.readyCount -= 1;
                    }
                    room.Players.List.splice(index, 1);
                    break;
                }
            }
        } else {
            cleanLastColor(roomIndex);
            if (room.Players.List[0].Ready == true) {
                room.readyCount -= 1;
            }
            room.Players.List.splice(0, 1);
            room.Host = {
                PlayerName: room.Players.List[0].PlayerName,
                SocketId: room.Players.List[0].SocketId
            };
        }
        //Add a new empty Player to the end of the array
        room.Players.List[3] = {
            PlayerName: '',
            SocketId: '',
            Color: '',
            Ready: false
        };

        socket.leave(roomNumber);
        socket.emit('leaveRoom');
        room.roomCount -= 1;

        if (room.roomCount == 0) {
            gameRooms.splice(roomIndex, 1);
        } else {
            io.to(roomNumber).emit('updatePlayerList', gameRooms[roomIndex].Players.List);
            io.to(roomNumber).emit('updateSelectedCharacters', gameRooms[roomIndex]);
            io.to(roomNumber).emit('updateReadyCount', gameRooms[roomIndex].readyCount);
        }

        sortGameRooms();
        io.sockets.emit('updateLobbyRooms', gameRooms);
    }
});

// io.of('/game').on('connection', (socket) => {
//     console.log('Game:', socket.id.replace('/game#', ''));
// });