const websocket = require("ws");
const wss = new websocket.Server({ port: 8080});

const rooms = {};

wss.on('connection', (ws) => {
    ws.on('message' , (message) => {
        const data = JSON.parse(message);
        if(data.type === 'join') {
            if(!rooms[data.room]) rooms[data.room] = new Set();
            rooms[data.room].add(ws);
            console.log(`${data.username} joined ${data.room}`);
        }
        else if(data.type === 'message')
        {
            rooms[data.room]?.forEach(client => {
                if(client.readyState === websocket.OPEN) {
                    client.send(JSON.stringify({
                        type:'message',
                        username: data.username,
                        message: data.message
                    }));
                }
            });
        }
        else if(data.type === 'typing') {
            rooms[data.room]?.forEach(client => {
                if(client !== ws && client.readyState === websocket.OPEN) {
                    client.send(JSON.stringify ({
                        type: 'typing',
                        username: data.username
                    }));
                }
            });
        } 
        else if(data.type === 'leave') {
            rooms[data.room]?.delete(ws);
            console.log(`${data.username} left ${data.room}`);
        }
    });

    ws.on('close' , () => {
        for(const room in rooms)
        {
            rooms[room].delete(ws);
        }
    });
});

console.log(`WebSocket server running on ws://localHost:8080`);