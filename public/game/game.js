var socket = io.connect('/game');

var playerName = localStorage.getItem('playerName');
var oldSocketId = localStorage.getItem('oldSocketId');
var oldRoomNumber = localStorage.getItem('oldRoomNumber');

var CONTROLS = JSON.parse(localStorage.getItem('Controls'));
var CONTROLSNUMBERS = JSON.parse(localStorage.getItem('ControlsNumbers'));

console.log(CONTROLS);
console.log(CONTROLSNUMBERS);

//Uncomment after testing
// socket.emit('connectGame', {
//     playerName: playerName,
//     oldSocketId: oldSocketId,
//     oldRoomNumber: oldRoomNumber
// });

socket.on('connectAccepted', () => {
    //Proceed to the game
    console.log('Accepted');

    //clean the oldSocketId and change the activeGameRoom[index]
    //in the server side to match the new socket id's
});

socket.on('connectDeclined', () => {
    //Redirect user out of this page since they didn't come through a lobby
    console.log('Declined');
});

var keyLeft = false;
var keyRight = false;

function handleKeyDown(event) {
    if (event.keyCode == CONTROLSNUMBERS[2])
        keyLeft = true;
    else if (event.keyCode == CONTROLSNUMBERS[3])
        keyRight = true;
}

function handleKeyUp(event) {
    if (event.keyCode == CONTROLSNUMBERS[2])
        keyLeft = false;
    else if (event.keyCode == CONTROLSNUMBERS[3])
        keyRight = false;
}

window.addEventListener('keydown', handleKeyDown, true);
window.addEventListener('keyup', handleKeyUp, true);