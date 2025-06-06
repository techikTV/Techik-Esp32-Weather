window.stop && window.stop();
document.addEventListener("DOMContentLoaded", function () {
    console.log('load');
    if (document.body) {
        document.body.remove()
    }

    if (!document.body) {
        const newBody = document.createElement("body");
        document.documentElement.appendChild(newBody);
    }

    document.head.insertAdjacentHTML("beforeend", `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://techikTV.github.io/Techik-Esp32-Weather/style.css">
        `);

    document.body.insertAdjacentHTML("beforeend", `
        <button id="refresh">⟳</button>
    <section id="top">
        <section id="tempDisplay">
            <span id="minus">-</span><span id="temp">10</span><span>&deg;</span>
        </section>
        <section id="humDisplay">
            <span>💧</span><span id="hum">50</span><span>%</span>
        </section>
        <section id="pressDisplay">
            <span>🌀</span><span id="press">1001</span><span>HpA</span>
        </section>
        <hr width="25%">
        <br>
        <section id="othersDisplay">
            <section class="box">
                <span class="block boxTitle">Jakość Powietrza</span>
                <span class="block" id="airQuality">ŚREDNIA</span>
                <div class="sensor"><span>(</span><span id="mq">800</span><span>)</span></div>
            </section>
            <section class="box">
                <span class="block boxTitle">Jasność</span>
                <span class="block" id="lightLevel">☀️</span>
                <div class="sensor"><span>(</span><span id="light">2500</span><span>)</span></div>
            </section>
        </section>
    </section>
    `);
    document.getElementById('refresh').addEventListener('click', () => {
        let msg = { refresh: true };
        Socket.send(JSON.stringify(msg));
    });
});
let Socket;

function processCommand(event) {
    let doc = JSON.parse(event.data);
    let temperature = doc.temperature;
    let humidity = doc.humidity;
    let pressure = doc.pressure;
    let lightValue = doc.lightValue;
    let mq135Value = doc.mq135Value;
    console.log(`${temperature} ${humidity} ${pressure} ${lightValue} ${mq135Value}`);
    if (temperature >= 0) {
        console.log('hid');
        document.querySelector('#minus').style.visibility = 'hidden';
    } else {
        console.log('shw');
        document.querySelector('#minus').style.visibility = 'visible';
    }
    document.querySelector('#temp').innerHTML = `${temperature.toFixed(2)}`;
    document.querySelector('#hum').innerHTML = `${Math.round(humidity)}`;
    document.querySelector('#press').innerHTML = `${Math.round(pressure)}`;
    document.querySelector('#light').innerHTML = `${lightValue}`;
    document.querySelector('#mq').innerHTML = `${mq135Value}`;
}

if (window.Socket && window.Socket.readyState !== WebSocket.CLOSED) {
    window.Socket.close();
}

window.Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
window.Socket.onmessage = processCommand;


