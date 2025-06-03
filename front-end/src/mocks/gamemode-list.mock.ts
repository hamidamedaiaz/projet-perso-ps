import { Gamemode } from "../models/gamemode.model";    

export const GAMEMODE_SOLO:Gamemode = {
    id:0,
    name:"Seul"
}

export const GAMEMODE_MULTI:Gamemode = {
    id:1,
    name:"En Groupe"
}

export const GAMEMODE_UNDEFINED: Gamemode = {
    id:-1,
    name:"Undefined"
}

export const GAMEMODE_LIST: Gamemode[] = [
    GAMEMODE_SOLO,
    GAMEMODE_MULTI,
]


