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
    <main id="weather">
        <section id="mainData">
            <div id="tempDisplay">
                <span id="minus">-</span><span id="temp">10</span><span>&deg;</span>
            </div>
            <div id="humDisplay">💧 <span id="hum">50</span>%</div>
            <div id="pressDisplay">🌀 <span id="press">1001</span> hPa</div>
        </section>
        <hr>
        <section id="extraData">
            <div class="card">
                <div class="label">Jakość Powietrza</div>
                <span class="block" id="airQuality">ŚREDNIA</span>
                <div class="sensor">( <span id="mq">800</span> )</div>
            </div>
            <div class="card">
                <div class="label">Jasność</div>
                <span class="block" id="lightLevel">☀️</span>
                <div class="sensor">( <span id="light">2500</span> )</div>
            </div>
        </section>
    </main>
    `);
    document.getElementById('refresh').addEventListener('click', () => {
        let msg = { refresh: true };
        Socket.send(JSON.stringify(msg));
    });
    setTimeout(checkBodyFlex, 3000);
});
let Socket;

function processCommand(event) {
    let doc = JSON.parse(event.data);
    if (doc.temperature) {
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
    } else {
        console.warn(event.data);
    }
    
}

Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
Socket.onmessage = processCommand;

//checking if css is loaded correctly (because sometimes not for some reason)
let reloadAttempts = 0;
const maxReloads = 5;

function checkBodyFlex() {
  const bodyStyle = window.getComputedStyle(document.body);
  if (bodyStyle.display !== 'flex') {
    console.warn('Has no display:flex, reloading with cache bypass');
    if (reloadAttempts < maxReloads) {
      reloadAttempts++;
      location.href = window.location.href.split('?')[0] + '?reload=' + new Date().getTime();
    }
  } else {
    console.log('Loaded correctly.');
  }
}


//reload on no websocket connection
function checkWebSocketConnection() {
  if (!Socket || Socket.readyState !== WebSocket.OPEN) {
    console.log('WebSocket nie jest połączony, odświeżam stronę...');
    location.reload();
  }
}

window.addEventListener('focus', checkWebSocketConnection);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    checkWebSocketConnection();
  }
});

