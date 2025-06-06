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
        document.querySelector('#temp').innerHTML = `${doc.temperature}`;
        document.querySelector('#hum').innerHTML = `${doc.humidity}`;
        document.querySelector('#press').innerHTML = `${doc.pressure}`;
        document.querySelector('#light').innerHTML = `${doc.lightValue}`;
        document.querySelector('#mq').innerHTML = `${doc.mq135Value}`;
    }

    Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
    Socket.onmessage = processCommand;


