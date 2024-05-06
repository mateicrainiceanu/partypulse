import ws from "ws"

export function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    console.log('A client connected!');

    client.on('message', message => {

        console.log(message);
        client.send(message);
    });

    client.emit("hello", "Hello From SV")

    client.on('close', () => {
        console.log('A client disconnected!');
    });
}