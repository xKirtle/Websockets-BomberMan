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

    let row = document.createElement('div');
    row.classList.add('row');
    row.textContent = 'Welcome back, ' + playerName;
    row.style.padding = '10px 0';
    container.appendChild(row);

    let colorsRow = document.createElement('div');
    colorsRow.classList.add('row');

    let labelRadio1 = document.createElement('label');
    labelRadio1.textContent = "Red";
    labelRadio1.classList.add('rowColor');

    let color1Radio = document.createElement('input');
    color1Radio.type = 'radio';
    color1Radio.name = 'Red';

    let color1Span = document.createElement('span');
    color1Span.classList.add('radio');

    labelRadio1.appendChild(color1Radio);
    labelRadio1.appendChild(color1Span);
    colorsRow.appendChild(labelRadio1);

    container.appendChild(colorsRow);
}