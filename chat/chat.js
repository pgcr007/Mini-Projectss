let ws = null;
let currentroom = "";
let username = "";
let typingtimeout = null;

function connectwebsocket() {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
        console.log(`connected to websocket server`);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'message') {
            displaymessage(data.username, data.message, data.username === username);
        }
        else if (data.type === 'typing') {
            showtypingindicator(data.username !== username);
        }
    };
    
    ws.onclose = () => {
        console.log(`Disconnected from websocket server`);
    };
}

function joinroom() {
    const roomselect = document.getElementById('room-name');
    const roominput =  roomselect.value;
    const userinput = document.getElementById('username').value.trim();

    if(!roominput && !userinput) {
        alert(`Please select a room and enter a username!`);
    } else if(!roominput)
    {
        alert('please select a room');
    } else if(!userinput)
    {
        alert('please enter a username')
    }
    else{
        currentroom = roominput;
        username = userinput;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            connectwebsocket();
        }

        setTimeout(() => {
            ws.send(JSON.stringify({
                type: 'join',
                room : currentroom,
                username: username
            }));
        }, 100);

        document.getElementById('room-selection').style.display= 'none';
        document.getElementById('chat-room').style.display = "block";
        document.getElementById('current-room').textContent = currentroom;
        document.getElementById('messages').innerHTML = "";
        roomselect.selectedindex = 0;
    }
}

function sendmessage()
{
    const input = document.getElementById("messages-input");
    const message = input.value.trim();

    if(message & ws & ws.readyState === WebSocket.OPEN)
    {
        const data = {
            type: "message",
            room: currentroom,
            username: username,
            message: message
        };
        ws.send(JSON.stringify(data));
        input.value = '';
        cleartyping();
    }
};

function displaymessage()
{
    const messagesdiv = document.getElementById("messages");
    const messagediv = document.createElement("div");

    messagediv.className = `message ${isSent ? 'sent' : 'recived'}`;
    messagediv.textContent = `${user}: ${message}`;
    messagesdiv.appendChild(messagediv);
    messagesdiv.scrollTop = messagesdiv.scrollHeight;

}

function showtypingindicator()
{
    const indicator = document.getElementById('typing-indicator');
    if(show)
    {
        indicator.style.display = 'block';
        setTimeout(() => indicator.style.display = 'none', 2000);
    }
    else
    {
        indicator.style.display = 'none';
    }
};

function notifytyping()
{
        if(ws && ws.readyState === WebSocket.OPEN)
        {
            ws.send(JSON.stringify({
                type: "typing",
                room: currentroom,
                username: username
            }));
        }
}

function cleartyping()
{
    clearTimeout(typingtimeout);
    typingtimeout = null;
}

function leaveroom()
{
    if(ws && ws.readyState === WebSocket.OPEN)
    {
        ws.send(JSON.stringify({
            type: 'leave',
            room: currentroom,
            username: username
        }));
        ws.close()
    }
    document.getElementById('chat-room').style.display = 'none';
    document.getElementById('room-selection').style.display = 'block';
    document.getElementById('username').value = "";
}

document.getElementById("messages-input").addEventListener('input', () => {
    if(!typingtimeout)
    {
        notifytyping();
        typingtimeout =  setTimeout(cleartyping, 2000)
    }
});

document.getElementById("messages-input").addEventListener('keypress', (e) => {
    if(e.key === 'Enter')
    {
        sendmessage();
    }
})
