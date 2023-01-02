import { GameObject } from "../gameobject/base.js"

class Character extends GameObject{
    constructor(root, info){
        super();

        this.root = root;
        this.id = info.id;
        this.width = info.width;
        this.height = info.height;
        this.x = info.x;
        this.y = info.y;
        this.color = info.color;
        this.direction = info.direction;

        this.vx = 0;
        this.vy = 0;

        this.gravity = 50;
        this.speedx = 600;
        this.speedy = 1000;

        this.ctx = this.root.gamemap.ctx;

        this.pressed_keys = this.root.gamemap.controller.pressed_keys;

        this.status = 3;
        //0: idle, 1: move forward, 2: move backward, 3: jump, 4: attack,
        //5: attacked, 6: died
        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    start(){

    }

    update_control(){
        let w, s, a, d, space;
        if(this.id === 0){
            w = this.pressed_keys.has('w');
            s = this.pressed_keys.has('s');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else{
            w = this.pressed_keys.has('ArrowUp');
            s = this.pressed_keys.has('ArrowDown');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if(this.status < 3){
            if(space){
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if(w){
                if(d){
                    this.vx = this.speedx;
                } else if(a){
                    this.vx = -this.speedx;
                } else this.vx = 0;
                this.vy = -this.speedy;
                this.frame_current_cnt = 0;
                this.status = 3;
            } else if(d){
                this.vx = this.speedx;
                this.status = 1;
            } else if(a){
                this.vx = -this.speedx;
                this.status = 1;
            } else this.vx = this.status = 0;
        }
    }

    update_move(){
        if(this.status === 3)
            this.vy += this.gravity;
        this.y += this.timedelta * this.vy / 1000;
        this.x += this.timedelta * this.vx / 1000;

        if(this.y > 400){
            this.y = 400;
            this.vy = 0;
            this.status = 0;
        }
        if(this.x < 0) this.x = 0;
        if(this.x + this.width > this.root.gamemap.ctx.canvas.width)
            this.x = this.root.gamemap.ctx.canvas.width - this.width;
    }

    update_direction(){
        let characters = this.root.characters;
        if(characters[0] && characters[1]){
            let me = this, opponent = characters[1 - this.id];
            if(me.x < opponent.x){
                me.direction = 1;
            } else me.direction = -1;
        }
    }

    update(){
        this.update_control();
        this.update_move();
        this.update_direction();

        this.update_render();
    }

    update_render(){
        // if(this.id === 0) console.log(this.status, this.direction, this.vx);
        if(this.status === 1 && this.direction * this.vx < 0){
            this.status = 2;
        }
        let status = this.status;
        let obj = this.animations.get(status);
        // if(this.status === 3) console.log(obj.frame_cnt);
        if(obj && obj.loaded){

            if(this.direction < 0){
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.gamemap.canvas.width(), 0);
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.gamemap.canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            } else{
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
        }

        if(status === 4 && parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt){
            this.status = 0;
        }

        ++ this.frame_current_cnt;
    }
}

export { Character }