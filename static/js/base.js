import { GameMap } from "../js/gamemap/base.js";
import { Kyo_Kusanagi } from "./characters/Kyo_Kusanagi.js";

class KOF{
    constructor(id){
        this.kof = $('#' + id);
        this.gamemap = new GameMap(this);
        this.characters = [
            new Kyo_Kusanagi(this, {
                id: 0,
                x: 0,
                y: 0,
                width: 150,
                height: 200,
                direction: 1,
                color: "red",
            }),
            new Kyo_Kusanagi(this, {
                id: 1,
                x: 500,
                y: 0,
                width: 150,
                height: 200,
                direction: -1,
                color: "blue",
            })
        ]
    }
}

export { KOF }