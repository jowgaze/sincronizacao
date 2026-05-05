let serverTime = null;

function timeToMinutes(timeStr) {
    if (!timeStr || timeStr.length !== 5) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function setServer() {
    const input = document.getElementById('serverTime').value.trim();
    const minutes = timeToMinutes(input);

    if (minutes === null) {
        alert('Por favor, insira uma hora válida no formato HH:MM');
        return;
    }

    serverTime = minutes;
    document.getElementById('displayServerTime').textContent = input;
    document.getElementById('serverStatus').textContent = '✓ Definido';
    document.getElementById('serverStatus').classList.remove('text-gray-800');
    document.getElementById('serverStatus').classList.add('text-emerald-600');
}

function sincronizar() {
    if (serverTime === null) {
        alert('Por favor, defina a hora do servidor primeiro!');
        return;
    }

    const client1TimeStr = document.getElementById('client1Time').value.trim();
    const client2TimeStr = document.getElementById('client2Time').value.trim();
    const client3TimeStr = document.getElementById('client3Time').value.trim();

    const client1Time = timeToMinutes(client1TimeStr);
    const client2Time = timeToMinutes(client2TimeStr);
    const client3Time = timeToMinutes(client3TimeStr);

    if (client1Time === null || client2Time === null || client3Time === null) {
        alert('Por favor, insira horas válidas para todos os clientes no formato HH:MM');
        return;
    }

    const client1SendStr = document.getElementById('client1SendTime').value.trim();
    const client2SendStr = document.getElementById('client2SendTime').value.trim();
    const client3SendStr = document.getElementById('client3SendTime').value.trim();

    const client1Send = timeToMinutes(client1SendStr);
    const client2Send = timeToMinutes(client2SendStr);
    const client3Send = timeToMinutes(client3SendStr);

    if (client1Send === null || client2Send === null || client3Send === null) {
        alert('Por favor, insira horas de envio válidas para todos os clientes no formato HH:MM');
        return;
    }

    const differences = [
        client1Time - serverTime,
        client2Time - serverTime,
        client3Time - serverTime,
        0
    ];

    const avgDifference = differences.reduce((a, b) => a + b, 0) / differences.length;
    const logicalClockMinutes = Math.round(serverTime + avgDifference);

    const adjustServer = Math.round(logicalClockMinutes - serverTime);
    const adjustClient1 = Math.round(logicalClockMinutes - client1Time);
    const adjustClient2 = Math.round(logicalClockMinutes - client2Time);
    const adjustClient3 = Math.round(logicalClockMinutes - client3Time);

    const clients = [
        { name: 'Cliente 1', time: client1Send },
        { name: 'Cliente 2', time: client2Send },
        { name: 'Cliente 3', time: client3Send }
    ];

    clients.sort((a, b) => a.time - b.time);

    document.getElementById('resultServerTime').textContent = minutesToTime(serverTime);
    document.getElementById('resultClient1Time').textContent = client1TimeStr;
    document.getElementById('resultClient2Time').textContent = client2TimeStr;
    document.getElementById('resultClient3Time').textContent = client3TimeStr;

    document.getElementById('logicalClock').textContent = minutesToTime(logicalClockMinutes);

    document.getElementById('adjustServer').textContent = `${adjustServer > 0 ? '+' : ''}${adjustServer}`;
    document.getElementById('adjustClient1').textContent = `${adjustClient1 > 0 ? '+' : ''}${adjustClient1}`;
    document.getElementById('adjustClient2').textContent = `${adjustClient2 > 0 ? '+' : ''}${adjustClient2}`;
    document.getElementById('adjustClient3').textContent = `${adjustClient3 > 0 ? '+' : ''}${adjustClient3}`;

    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';
    clients.forEach((client, index) => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2.5 bg-white border border-emerald-200 p-2 rounded text-xs';
        li.innerHTML = `
            <div class="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">${index + 1}º</div>
            <div class="text-gray-700 text-xs"><strong>${client.name}</strong> - ${minutesToTime(client.time)}</div>
        `;
        rankingList.appendChild(li);
    });

    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.classList.remove('hidden');
    resultsPanel.classList.add('flex');
}

document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (document.activeElement.id.includes('serverTime')) {
            setServer();
        } else if (document.activeElement.id.includes('Time') || document.activeElement.id.includes('SendTime')) {
            sincronizar();
        }
    }
});
