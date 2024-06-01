'use server'

import Events from '../_lib/models/event';
import SongRequest from '../_lib/models/songRequest';

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

        if (data.evId)
            evId = data.evId;

        if (data.token)
            token = data.token;

        if (data.reqId && data.newStatus) 
            await SongRequest.changeReqStatus(data.reqId, data.newStatus)
        
        let suggestions = []

        if (evId) {
            suggestions = await Events.getMusicSuggestions(evId)
        }
        client.send(Buffer.from(JSON.stringify(suggestions)));
    });

    intervalId = setInterval(async () => {
        let suggestions = []

        if (evId) {
            suggestions = await Events.getMusicSuggestions(evId)
        }       
        client.send(Buffer.from(JSON.stringify(suggestions)));
    }, 3000) as any

    client.on('close', () => {
        clearInterval(intervalId)
        console.log('A client disconnected!');
    });
}