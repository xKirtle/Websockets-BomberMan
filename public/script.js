"use strict";
//Make connection
var socket = io.connect();

//DOM QUERIES
var playerName = localStorage.getItem('playerName');
var body = document.getElementsByTagName('body')[0];
var containerPromptName = document.getElementById('containerPromptName');
var containerMainMenu = document.getElementById('containerMainMenu');
var containerOptionsMenu = document.getElementById('containerOptionsMenu');
var containerStartMenu = document.getElementById('containerStartMenu');
var welcome = document.getElementById('welcome');
var playerNameInput = document.getElementById('inputName');
var startGame = document.getElementById('startGame');
var changeHotkeys = document.getElementById('changeHotkeys');
var displayHotkeyUp = document.getElementById('displayHotkeyUp');
var displayHotkeyDown = document.getElementById('displayHotkeyDown');
var keyInputUp = document.getElementById('keyInputUp');
var keyInputDown = document.getElementById('keyInputDown');
var applyNewKeyUp = document.getElementById('applyNewKeyUp');
var applyNewKeyDown = document.getElementById('applyNewKeyDown');

//Controls (Up, Down, Left, Right) (https://keycode.info/)
var customKeys;
if (localStorage.getItem('CustomKeys') == 'true') {
    customKeys = localStorage.getItem('CustomKeys');
} else {
    customKeys = false;
}

if (customKeys) {
    var CONTROLS = JSON.parse(localStorage.getItem('Controls'));
    var CONTROLSNUMBERS = JSON.parse(localStorage.getItem('ControlsNumbers'));
} else {
    var CONTROLS = ['UpArrow', 'DownArrow', 'LeftArrow', 'RightArrow'];
    var CONTROLSNUMBERS = [87, 83, 65, 68];
}

//Emit Events
socket.emit('socketConnection', playerName);
socket.emit('connection', playerName);

//Receive Events
socket.on('promptName', () => {
    promptName();
});

socket.on('generatePage', () => {
    generatePage();
});

//Functions
function slideOutAndChange(container, func) {
    container.classList.add('slideOut');
    container.style.marginTop = '-600px';
    setTimeout(() => {
        func();
    }, 600);
}

function visible(PromptName, MainMenu, OptionsMenu, StartMenu) {
    PromptName == true ? containerPromptName.classList.remove('invisible') : containerPromptName.classList.add('invisible');
    MainMenu == true ? containerMainMenu.classList.remove('invisible') : containerMainMenu.classList.add('invisible');
    OptionsMenu == true ? containerOptionsMenu.classList.remove('invisible') : containerOptionsMenu.classList.add('invisible');
    StartMenu == true ? containerStartMenu.classList.remove('invisible') : containerStartMenu.classList.add('invisible');
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
    welcome.textContent = 'Welcome back, ' + playerName;

    startGame.addEventListener('click', () => {
        slideOutAndChange(containerMainMenu, startGamePage);
    });

    changeHotkeys.addEventListener('click', () => {
        slideOutAndChange(containerMainMenu, changeHotkeysPage);
    });
}

function startGamePage() {
    let container = document.createElement('div');
    container.classList.add('container');
    container.id = 'container';
    //container.style.height = '300px';
    body.appendChild(container);

    //Top Row
    let row = document.createElement('div');
    row.classList.add('row');
    row.textContent = 'CHOOSE A CHARACTER';
    row.style.padding = '10px 0';
    container.appendChild(row);

    //Radio Buttons Row
    let colorsRow = document.createElement('div');
    colorsRow.classList.add('row');

    //Radio button Red
    let labelRadio1 = document.createElement('label');
    labelRadio1.textContent = "Red";
    labelRadio1.classList.add('rowColor');

    let color1Radio = document.createElement('input');
    color1Radio.type = 'radio';
    color1Radio.name = 'color';
    color1Radio.value = 'Red';

    let color1Span = document.createElement('span');
    color1Span.classList.add('radio');
    color1Span.classList.add('red');

    labelRadio1.appendChild(color1Radio);
    labelRadio1.appendChild(color1Span);
    colorsRow.appendChild(labelRadio1);

    //Radio button Blue
    let labelRadio2 = document.createElement('label');
    labelRadio2.textContent = "Blue";
    labelRadio2.classList.add('rowColor');

    let color2Radio = document.createElement('input');
    color2Radio.type = 'radio';
    color2Radio.name = 'color';
    color2Radio.value = 'Blue';

    let color2Span = document.createElement('span');
    color2Span.classList.add('radio');
    color2Span.classList.add('blue');

    labelRadio2.appendChild(color2Radio);
    labelRadio2.appendChild(color2Span);
    colorsRow.appendChild(labelRadio2);

    //Radio button Pink
    let labelRadio3 = document.createElement('label');
    labelRadio3.textContent = "Pink";
    labelRadio3.classList.add('rowColor');

    let color3Radio = document.createElement('input');
    color3Radio.type = 'radio';
    color3Radio.name = 'color';
    color3Radio.value = 'Pink';

    let color3Span = document.createElement('span');
    color3Span.classList.add('radio');
    color3Span.classList.add('pink');

    labelRadio3.appendChild(color3Radio);
    labelRadio3.appendChild(color3Span);
    colorsRow.appendChild(labelRadio3);

    //Radio button Green
    let labelRadio4 = document.createElement('label');
    labelRadio4.textContent = "Gray";
    labelRadio4.classList.add('rowColor');

    let color4Radio = document.createElement('input');
    color4Radio.type = 'radio';
    color4Radio.name = 'color';
    color4Radio.value = 'Gray';

    let color4Span = document.createElement('span');
    color4Span.classList.add('radio');
    color4Span.classList.add('gray');

    labelRadio4.appendChild(color4Radio);
    labelRadio4.appendChild(color4Span);
    colorsRow.appendChild(labelRadio4);

    container.appendChild(colorsRow);
}

function changeHotkeysPage() {
    visible(false, false, true, false);

    displayHotkeyUp.textContent = CONTROLS[0];
    displayHotkeyDown.textContent = CONTROLS[1];
    keyInputUp.value = CONTROLS[0];
    keyInputDown.value = CONTROLS[1];

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
                break;
            case 'right':
                break;
        }
    }

    function displayClickEvent(Key, Index, displayHotkey, keyInput, applyNewKey) {
        hotKeysVisible(Key, false, true, true);

        //Presses any key on the keyboard to change it
        let previewCONTROLS = [];
        let previewCONTROLSNUMBERS = [];
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
}