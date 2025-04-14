import {getRadialGradient} from "../utils.js";

export class Eyes {
    #gradient = null;
    #colorStops = [{percent:0,color:"red"},{percent:1,color:"black"}];
    #r = 0;
    #g = 0;
    #b = 0;
    constructor(ctx,x,y,radius,audioData) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.audioData = audioData;
    }
    update(r,g,b) {
      // set color
      this.#r = r;
      this.#g = g;
      this.#b = b;

      // set alpha based on audio data
      let alphaOffset = 0;
      let alpha = 1;
      for (let i = 0; i < this.audioData.length; i++) {
        alphaOffset += (this.audioData[i] / 255);
      }
      alphaOffset /= this.audioData.length;
      alphaOffset *= 0.75;
      alpha -= alphaOffset;

      this.#colorStops = [{percent:0,color:`rgba(${this.#r},${this.#g},${this.#b},${alpha})`},{percent:1,color:"black"}];
      //console.log(this.#colorStops);
      // update gradient (color changes)
      this.#gradient = getRadialGradient(this.ctx,
                                         this.x,
                                         this.y + 20,
                                         5,
                                         this.x,
                                         this.y,
                                         this.radius,
                                         this.#colorStops);
    }
    draw() {
      this.ctx.save();
      this.ctx.fillStyle = this.#gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }