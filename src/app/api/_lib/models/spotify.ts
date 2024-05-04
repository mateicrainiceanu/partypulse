import axios from "axios"
import queryString from "querystring"

interface Spotify {
    token?: string
}

export interface Track {
    id: string,
    name: String,
    album: {
        images: Array<{ height: number, width: number, url: string }>
    },
    artists: Array<{name:string}>
}

class Spotify {
    async authorise() {
        await axios.post("https://accounts.spotify.com/api/token", queryString.stringify({ grant_type: "client_credentials", client_id: process.env.SPOTIFY_CLIENT_ID, client_secret: process.env.SPOTIFY_CLIENT_SECRET })).then(res => {
            this.token = res.data.access_token
        })
    }

    async search(q: string) {
        return axios.get(`https://api.spotify.com/v1/search?q=${q}&type=track`, { headers: { Authorization: `Bearer ${this.token}` } }).then(res => {
            return res.data
        }).catch(err => {
            console.log(err);
        })
    }
}

export default Spotify