"use strict";
//Make connection
var socket = io.connect();

//DOM QUERIES
var playerName = localStorage.getItem('playerName');
var body = document.getElementsByTagName('body')[0];
//Containers
var containerPromptName = document.getElementById('containerPromptName');
var containerMainMenu = document.getElementById('containerMainMenu');
var containerOptionsMenu = document.getElementById('containerOptionsMenu');
var containerStartMenu = document.getElementById('containerStartMenu');
//Welcome message row
var welcome = document.getElementById('welcome');
var playerNameInput = document.getElementById('inputName');
var startGame = document.getElementById('startGame');
var optionsMenu = document.getElementById('optionsMenu');
//Hotkey Up
var displayHotkeyUp = document.getElementById('displayHotkeyUp');
var keyInputUp = document.getElementById('keyInputUp');
var applyNewKeyUp = document.getElementById('applyNewKeyUp');
//Hotkey Down
var displayHotkeyDown = document.getElementById('displayHotkeyDown');
var keyInputDown = document.getElementById('keyInputDown');
var applyNewKeyDown = document.getElementById('applyNewKeyDown');
//Hotkey Left
var displayHotkeyLeft = document.getElementById('displayHotkeyLeft');
var keyInputLeft = document.getElementById('keyInputLeft');
var applyNewKeyLeft = document.getElementById('applyNewKeyLeft');
//Hotkey Right
var displayHotkeyRight = document.getElementById('displayHotkeyRight');
var keyInputRight = document.getElementById('keyInputRight');
var applyNewKeyRight = document.getElementById('applyNewKeyRight');
//Hotkey Space
var displayHotKeySpace = document.getElementById('displayHotkeySpace');
var keyInputSpace = document.getElementById('keyInputSpace');
var applyNewKeySpace = document.getElementById('applyNewKeySpace');
//Go back button Options Menu
var OptionsGoBack = document.getElementById('OptionsGoBack');
//Lobby Menu
var joinRoomInputNumber = document.getElementById('joinRoomInputNumber');
var joinRoom = document.getElementById('joinRoom');
var LobbyGoBack = document.getElementById('LobbyGoBack');
var lobbyRooms = document.getElementById('lobbyRooms');
var lobbyRoomsPlayerCount = document.getElementById('lobbyRoomsPlayerCount');
var startMenuRoom = document.getElementById('startMenuRoom');
var lobbyFinderRoom = document.getElementById('lobbyFinderRoom');
//playerNames on Start Menu
var StartGoBack = document.getElementById('StartGoBack');
var playerNameRed = document.getElementById('playerNameRed');
var playerNameBlue = document.getElementById('playerNameBlue');
var playerNamePink = document.getElementById('playerNamePink');
var playerNameGray = document.getElementById('playerNameGray');
var playerReadyCount = document.getElementById('playerReadyCount');
//Character Selection
var red = document.getElementById('red');
var blue = document.getElementById('blue');
var pink = document.getElementById('pink');
var gray = document.getElementById('gray');


//Controls (Up, Down, Left, Right, Space) (https://keycode.info/)
var customKeys = localStorage.getItem('CustomKeys') == 'true' ? localStorage.getItem('CustomKeys') : false;
let _roomNumber;
if (customKeys) {
    var CONTROLS = JSON.parse(localStorage.getItem('Controls'));
    var CONTROLSNUMBERS = JSON.parse(localStorage.getItem('ControlsNumbers'));
} else {
    var CONTROLS = ['UpArrow', 'DownArrow', 'LeftArrow', 'RightArrow', 'Space'];
    var CONTROLSNUMBERS = [87, 83, 65, 68, 32];
}

//Emit Events
socket.emit('socketConnection', playerName);
socket.emit('connection', playerName);

//Receive Events
socket.on('promptName', () => {
    promptName();
});

socket.on('generatePage', (gameRooms) => {
    generatePage();
    updateLobbyRooms(gameRooms);
});

socket.on('joinRoom', () => {
    slideOutAndChange(containerStartMenu, startGamePage);
    setTimeout(() => {
        lobbyFinderRoom.classList.add('invisible');
        startMenuRoom.classList.remove('invisible');
    }, 600);
});

socket.on('leaveRoom', () => {
    slideOutAndChange(containerStartMenu, startGamePage);
    setTimeout(() => {
        startMenuRoom.classList.add('invisible');
        lobbyFinderRoom.classList.remove('invisible');
    }, 600);
});

socket.on('updateLobbyRooms', (gameRoomsReceived) => {
    updateLobbyRooms(gameRoomsReceived);
});

socket.on('updatePlayerCount', (roomCount) => {
    // TODO: Change below
    //Updating the Ready count right now..
    playerReadyCount.value = roomCount + '/4';
});

//Functions
function slideOutAndChange(container, func) {
    container.classList.add('slideOut');
    container.style.marginTop = '-600px';
    setTimeout(() => {
        func();
    }, 600);
    setTimeout(() => {
        container.classList.remove('slideOut');
        container.style.marginTop = '20px';
    }, 600);
}

function visible(PromptName, MainMenu, OptionsMenu, StartMenu) {
    PromptName == true ? containerPromptName.classList.remove('invisible') : containerPromptName.classList.add('invisible');
    MainMenu == true ? containerMainMenu.classList.remove('invisible') : containerMainMenu.classList.add('invisible');
    OptionsMenu == true ? containerOptionsMenu.classList.remove('invisible') : containerOptionsMenu.classList.add('invisible');
    StartMenu == true ? containerStartMenu.classList.remove('invisible') : containerStartMenu.classList.add('invisible');
}

function updateLobbyRooms(gameRooms) {
    //Removes everything from the list
    while (lobbyRooms.firstChild && lobbyRoomsPlayerCount.firstChild) {
        lobbyRooms.removeChild(lobbyRooms.firstChild);
        lobbyRoomsPlayerCount.removeChild(lobbyRoomsPlayerCount.firstChild);
    }

    //Populates the list again
    let divRooms = document.createElement('div');
    divRooms.classList.add('borderBottom');
    divRooms.classList.add('lobbyRoomsTitle');
    divRooms.style.borderTopLeftRadius = '6px';
    divRooms.textContent = 'Rooms';
    lobbyRooms.appendChild(divRooms);

    let divRoomsPlayerCounter = document.createElement('div');
    divRoomsPlayerCounter.classList.add('borderBottom');
    divRoomsPlayerCounter.classList.add('lobbyRoomsTitle');
    divRoomsPlayerCounter.style.borderTopRightRadius = '6px';
    divRoomsPlayerCounter.textContent = 'Players'
    lobbyRoomsPlayerCount.appendChild(divRoomsPlayerCounter);

    for (let i = 0; i < gameRooms.length; i++) {
        let div = document.createElement('div');
        div.classList.add('borderBottom');
        div.textContent = 'Room ' + gameRooms[i].roomNumber;
        lobbyRooms.appendChild(div);

        let div2 = document.createElement('div');
        div2.classList.add('borderBottom');
        div2.textContent = gameRooms[i].roomCount + '/4';
        lobbyRoomsPlayerCount.appendChild(div2);
    }
}

function promptName() {
    visible(true, false, false, false);

    playerNameInput.addEventListener('keypress', (evt) => {
        let keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if (keycode == '13') {
            localStorage.setItem('playerName', playerNameInput.value);
            playerName = localStorage.getItem('playerName');
            slideOutAndChange(containerPromptName, generatePage);
        }
    });
}

function generatePage() {
    visible(false, true, false, false);
    containerMainMenu.classList.remove('slideOut');
    welcome.textContent = 'Welcome back, ' + playerName;

    startGame.addEventListener('click', () => {
        slideOutAndChange(containerMainMenu, startGamePage);
    });

    optionsMenu.addEventListener('click', () => {
        slideOutAndChange(containerMainMenu, optionsMenuPage);
    });
}

function startGamePage() {
    visible(false, false, false, true);

    LobbyGoBack.addEventListener('click', () => {
        slideOutAndChange(containerStartMenu, generatePage);
    });
    joinRoomInputNumber.addEventListener('input', function () {
        this.value = Math.abs(this.value.replace(/[^0-9]/g, '').slice(0, this.maxLength));
    });
    joinRoom.addEventListener('click', () => {
        socket.emit('joinRoom', {
            roomNumber: joinRoomInputNumber.value,
            playerName: playerName
        });

        _roomNumber = joinRoomInputNumber.value;
    });

    StartGoBack.addEventListener('click', () => {
        socket.emit('leaveRoom', _roomNumber);
    });

    red.addEventListener('click', () => {
        selectChar();
        //Removes last character selected, if any
        //playerNameRed.textContent = playerName;
    });

    blue.addEventListener('click', () => {

    });

    pink.addEventListener('click', () => {

    });

    gray.addEventListener('click', () => {

    });

    function selectChar() {

    }
}

function optionsMenuPage() {
    visible(false, false, true, false);

    displayHotkeyUp.textContent = CONTROLS[0];
    displayHotkeyDown.textContent = CONTROLS[1];
    displayHotkeyLeft.textContent = CONTROLS[2];
    displayHotkeyRight.textContent = CONTROLS[3];
    displayHotKeySpace.textContent = CONTROLS[4];
    keyInputUp.value = CONTROLS[0];
    keyInputDown.value = CONTROLS[1];
    keyInputLeft.value = CONTROLS[2];
    keyInputRight.value = CONTROLS[3];
    keyInputSpace.value = CONTROLS[4];

    function hotKeysVisible(Key, DisplayHotKey, KeyInput, ApplyNewKey) {
        switch (Key) {
            case 'up':
                DisplayHotKey == true ? displayHotkeyUp.classList.remove('invisible') : displayHotkeyUp.classList.add('invisible');
                KeyInput == true ? keyInputUp.classList.remove('invisible') : keyInputUp.classList.add('invisible');
                ApplyNewKey == true ? applyNewKeyUp.classList.remove('invisible') : applyNewKeyUp.classList.add('invisible');
                break;
            case 'down':
                DisplayHotKey == true ? displayHotkeyDown.classList.remove('invisible') : displayHotkeyDown.classList.add('invisible');
                KeyInput == true ? keyInputDown.classList.remove('invisible') : keyInputDown.classList.add('invisible');
                ApplyNewKey == true ? applyNewKeyDown.classList.remove('invisible') : applyNewKeyDown.classList.add('invisible');
                break;
            case 'left':
                DisplayHotKey == true ? displayHotkeyLeft.classList.remove('invisible') : displayHotkeyLeft.classList.add('invisible');
                KeyInput == true ? keyInputLeft.classList.remove('invisible') : keyInputLeft.classList.add('invisible');
                ApplyNewKey == true ? applyNewKeyLeft.classList.remove('invisible') : applyNewKeyLeft.classList.add('invisible');
                break;
            case 'right':
                DisplayHotKey == true ? displayHotkeyRight.classList.remove('invisible') : displayHotkeyRight.classList.add('invisible');
                KeyInput == true ? keyInputRight.classList.remove('invisible') : keyInputRight.classList.add('invisible');
                ApplyNewKey == true ? applyNewKeyRight.classList.remove('invisible') : applyNewKeyRight.classList.add('invisible');
                break;
            case 'space':
                DisplayHotKey == true ? displayHotkeySpace.classList.remove('invisible') : displayHotkeySpace.classList.add('invisible');
                KeyInput == true ? keyInputSpace.classList.remove('invisible') : keyInputSpace.classList.add('invisible');
                ApplyNewKey == true ? applyNewKeySpace.classList.remove('invisible') : applyNewKeySpace.classList.add('invisible');
                break;
        }
    }

    // TODO: Prevent duplicate keys
    function displayClickEvent(Key, Index, displayHotkey, keyInput, applyNewKey) {
        hotKeysVisible(Key, false, true, true);

        //Presses any key on the keyboard to change it
        let previewCONTROLS = [];
        let previewCONTROLSNUMBERS = [];
        keyInput.value = displayHotkey.textContent;
        var myKeyDown = function (evt) {
            // TODO: Implement a constant of valid accepted keys

            //!Escape
            if (evt.keyCode != '27') {
                let keyDown = evt.code.replace('Key', '').replace('Digit', '');
                keyInput.value = keyDown;
                previewCONTROLS[Index] = keyDown;
                previewCONTROLSNUMBERS[Index] = evt.keyCode;

                customKeys = true;
            } else {
                window.removeEventListener('keydown', myKeyDown);
                displayHotkey.textContent = CONTROLS[Index];

                hotKeysVisible(Key, true, false, false);
            }
        }

        window.addEventListener('keydown', myKeyDown);
        applyNewKey.addEventListener('click', () => {
            window.removeEventListener('keydown', myKeyDown);

            CONTROLS[Index] = previewCONTROLS[Index];
            CONTROLSNUMBERS[Index] = previewCONTROLSNUMBERS[Index];
            displayHotkey.textContent = CONTROLS[Index];

            localStorage.setItem('Controls', JSON.stringify(CONTROLS));
            localStorage.setItem('ControlsNumbers', JSON.stringify(CONTROLSNUMBERS));
            localStorage.setItem('CustomKeys', true);

            hotKeysVisible(Key, true, false, false);
        });
    }

    //Clicks to change current key
    displayHotkeyUp.addEventListener('click', () => {
        displayClickEvent('up', 0, displayHotkeyUp, keyInputUp, applyNewKeyUp);
    });

    displayHotkeyDown.addEventListener('click', () => {
        displayClickEvent('down', 1, displayHotkeyDown, keyInputDown, applyNewKeyDown);
    });

    displayHotkeyLeft.addEventListener('click', () => {
        displayClickEvent('left', 2, displayHotkeyLeft, keyInputLeft, applyNewKeyLeft);
    });

    displayHotkeyRight.addEventListener('click', () => {
        displayClickEvent('right', 3, displayHotkeyRight, keyInputRight, applyNewKeyRight);
    });

    displayHotKeySpace.addEventListener('click', () => {
        displayClickEvent('space', 4, displayHotKeySpace, keyInputSpace, applyNewKeySpace);
    });

    //Go back to Main Menu
    OptionsGoBack.addEventListener('click', () => {
        slideOutAndChange(containerOptionsMenu, generatePage);
    });
}