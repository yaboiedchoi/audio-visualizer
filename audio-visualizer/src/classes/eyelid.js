export class Eyelid {
    #eyelidOffset = 0;
    constructor(ctx, topLeftX, topLeftY, bottomLeftX, bottomLeftY, shortWidth, wideWidth, audioData) {
      this.ctx = ctx;
      this.topLeftX = topLeftX;
      this.topLeftY = topLeftY;
      this.bottomLeftX = bottomLeftX;
      this.bottomLeftY = bottomLeftY;
      this.shortWidth = shortWidth;
      this.wideWidth = wideWidth;
      this.audioData = audioData;
    }
    update(){
      this.#eyelidOffset = 0;
      for (let i = 0; i < this.audioData.length; i++) {
        this.#eyelidOffset += (this.audioData[i] / 255);
      }
      this.#eyelidOffset /= this.audioData.length;
    }
    draw(){
      this.ctx.save();
      this.ctx.fillStyle = "gray";
      this.ctx.translate(0, -this.#eyelidOffset * 40);
      this.ctx.beginPath();
      this.ctx.moveTo(this.topLeftX,this.topLeftY); 
      this.ctx.lineTo(this.topLeftX + this.shortWidth,this.topLeftY);
      this.ctx.lineTo(this.bottomLeftX + this.wideWidth,this.bottomLeftY);
      this.ctx.lineTo(this.bottomLeftX,this.bottomLeftY);
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
    }
  }