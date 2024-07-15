export interface formElement {
    name: string,
    type: string,
}

export interface FullLocation {
    id: number,
    private: number,
    name: string,
    useForAdress: string,
    adress: string,
    city: string,
    lon: 0,
    lat: 0,
    userHasRightToManage: boolean,
    liked: boolean
}

export interface FullEvent {
    id: number;
    name: string;
    location: string;
    dateStart: string;
    djs: Array<string>;
    status: number;
    userHasRightToManage: number;
    there: boolean;
    coming: boolean;
    liked: boolean;
    genreVote: number;
    msuggestions: number;
    nrliked: number;
    nrcoming: number;
} 