function onAjaxResponse() {
    var data = JSON.parse(this.response);
    updateCountElement(data.count);
}

function onIncrementClick(e) {
    e.preventDefault();

    var request = new XMLHttpRequest();

    request.addEventListener('load', onAjaxResponse);

    request.open('GET', '/ajax');

    request.send();
}

function updateCountElement(count) {
    var countElement = document.querySelector('#count');

    countElement.innerHTML = count;
}

function connect() {
    var socket = io();

    socket.on('count', function(count) {
        updateCountElement(count);
    });
}

function onStartup() {
    var link = document.querySelector('#incrementCounterLink');

    link.addEventListener('click', onIncrementClick);

    connect();
}

document.addEventListener('DOMContentLoaded', onStartup);
