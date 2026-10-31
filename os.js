function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    document.getElementById('time-clock').innerText = `${hours}:${minutes} ${ampm}`;

    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    document.getElementById('date-clock').innerText = now.toLocaleDateString('en-US', options);
}
setInterval(updateClock, 1000);
updateClock();

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('open');
}

document.getElementById('desktop').addEventListener('click', (e) => {
    if(e.target.id === 'desktop') {
        document.getElementById('start-menu').classList.remove('open');
    }
});

function focusWindow(id) {
    document.querySelectorAll('.window').forEach(win => win.classList.remove('focused'));
    const targetedWin = document.getElementById(id);
    if(targetedWin) targetedWin.classList.add('focused');
}

function openApp(id) {
    const win = document.getElementById(id);
    win.style.display = 'flex';
    focusWindow(id);
    
    if(id === 'chrome-window') {
        document.getElementById('chrome-taskbar-icon').classList.add('active');
    }
}

function closeApp(id) {
    const win = document.getElementById(id);
    win.style.display = 'none';
    if(id === 'chrome-window') {
        document.getElementById('chrome-taskbar-icon').classList.remove('active');
    }
}

function minimizeApp(id) {
    document.getElementById(id).style.display = 'none';
}

function maximizeApp(id) {
    const win = document.getElementById(id);
    if (win.style.width === '100%') {
        win.style.width = '75%';
        win.style.height = '72%';
        win.style.top = '12%';
        win.style.left = '15%';
    } else {
        win.style.width = '100%';
        win.style.height = 'calc(100% - 52px)';
        win.style.top = '0';
        win.style.left = '0';
    }
}

let activeWin = null;
let offsetX = 0, offsetY = 0;

function dragStart(e, id) {
    focusWindow(id);
    activeWin = document.getElementById(id);
    if(activeWin.style.width === '100%') return;
    
    offsetX = e.clientX - activeWin.offsetLeft;
    offsetY = e.clientY - activeWin.offsetTop;
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
    if (!activeWin) return;
    activeWin.style.left = `${e.clientX - offsetX}px`;
    activeWin.style.top = `${e.clientY - offsetY}px`;
}

function dragEnd() {
    activeWin = null;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
}