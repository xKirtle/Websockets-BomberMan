"use strict";
//Make connection
var socket = io.connect();

//DOM QUERIES
var body = document.getElementsByTagName('body')[0];
var playerName = localStorage.getItem('playerName');

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
function promptName() {
    let container = document.createElement('div');
    container.classList.add('container');
    container.id = 'container';
    body.appendChild(container);

    let containerTitle = document.createElement('label');
    containerTitle.textContent = 'What is your name?';
    containerTitle.style.fontSize = '26px';
    container.appendChild(containerTitle);

    let playerInfoPanel = document.createElement('div');
    playerInfoPanel.classList.add('playerInfo');
    container.appendChild(playerInfoPanel);

    let playerNameInput = document.createElement('input');
    playerNameInput.type = 'text';
    playerNameInput.classList.add('inputName');
    playerNameInput.placeholder = 'Your name goes here..';
    playerNameInput.maxLength = '32';
    playerInfoPanel.appendChild(playerNameInput);

    playerNameInput.addEventListener('keypress', (evt) => {
        let keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if (keycode == '13') {
            localStorage.setItem('playerName', playerNameInput.value);
            playerName = localStorage.getItem('playerName');
            container.classList.add('slideOut');
            container.style.marginTop = '-300px';
            setTimeout(() => {
                while (body.firstChild) {
                    body.removeChild(body.firstChild);
                }
                generatePage();
            }, 500);
        }
    });
}

function generatePage() {
    let container = document.createElement('div');
    container.classList.add('container');
    container.id = 'container';
    container.style.height = '300px';
    body.appendChild(container);

    //Top Row
    let row = document.createElement('div');
    row.classList.add('row');
    row.textContent = 'Welcome back, ' + playerName;
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