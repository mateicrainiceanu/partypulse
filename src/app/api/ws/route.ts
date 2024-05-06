import Events from '../_lib/models/event';

export async function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    console.log('A client connected!');
    let intervalId: string | number

    let evId: number
    let token: string

    client.on('message', async message => {
        let data = JSON.parse(message.toString());

        if (data.evId) {
            evId = data.evId;
        }
        if (data.token) {
            token = data.token;
        }

        let suggestions = []

        if (evId) {
            suggestions = await Events.getMusicSuggestions(evId)
        }
        client.send(new Buffer(JSON.stringify(suggestions)));
    });

    intervalId = setInterval(async () => {
        let suggestions = []

        if (evId) {
            suggestions = await Events.getMusicSuggestions(evId)
        }
        client.send(new Buffer(JSON.stringify(suggestions)));
    }, 3000) as any

    client.on('close', () => {
        clearInterval(intervalId)
        console.log('A client disconnected!');
    });
}

export function GET() {

}