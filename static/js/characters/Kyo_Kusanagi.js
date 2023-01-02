import { Character } from "./base.js";
import { GIF } from "../utils/gif.js";

class Kyo_Kusanagi extends Character{
    constructor(root, info){
        super(root, info);

        this.init_animations();
    }

    init_animations(){

        let outer = this;
        let offsets = [0, -33, -33, -250, 0, 0, 0];

        for(let i = 0; i < 7; ++ i){
            let gif = GIF();
            gif.load(`/static/images/characters/Kyo_Kusanagi/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,
                offset_y: offsets[i],
                loaded: false,
                scale: 3,
            });

            gif.onload = function(){
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if(i === 3){
                    obj.frame_rate = 3;
                }
            }
        }
    }
}

export{
    Kyo_Kusanagi,
}