/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import * as eyes from './classes/eyes.js';
import * as eyelid from './classes/eyelid.js';

let ctx,
    canvasWidth,
    canvasHeight,
    gradient,
    analyserNode,
    audioData,
    headGradient,
    leftEye,
    rightEye,
    eyelidLeft,
    eyelidRight;

// debug
let eyeGradientR;

// eye colors
let eyeColorR = 255;
let eyeColorG = 255;
let eyeColorB = 255;

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
    console.log(canvasWidth + ", " + canvasHeight);
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"purple"},{percent:.5,color:"black"},{percent:.75,color:"purple"},{percent:1,color:"blue"}]);
    headGradient = utils.getLinearGradient(ctx,canvasWidth/2,0,canvasWidth/2,canvasHeight,[{percent:1,color:"gray"},{percent:0,color:"skyblue"}]);

    // gradient for eyes
    //eyeGradientL = utils.getRadialGradient(ctx,canvasWidth/2 - 80,canvasHeight/2 - 60,5,canvasWidth/2 - 80,canvasHeight/2 - 80,40,[{percent:0,color:"red"},{percent:1,color:"black"}]);
    eyeGradientR = utils.getRadialGradient(ctx,canvasWidth/2 + 80,canvasHeight/2 - 60,5,canvasWidth/2 + 80,canvasHeight/2 - 80,40,[{percent:0,color:"red"},{percent:1,color:"black"}]);

    // keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);

    // eyelids classes
    eyelidLeft = new eyelid.Eyelid(ctx,280,80,260,120,80,120,audioData);
    eyelidRight = new eyelid.Eyelid(ctx,440,80,420,120,80,120,audioData);

    // hook up sliders to eye color
    let eyeColorRLabel = document.querySelector("#color-label-r");
    document.querySelector("#eye-color-r").oninput = (e) => {
        eyeColorR = e.target.value;
        console.log(eyeColorR + ", " + eyeColorG + ", " + eyeColorB);
        eyeColorRLabel.innerText = eyeColorR;
    }
    
    // eye color g
    let eyeColorGLabel = document.querySelector("#color-label-g");
    document.querySelector("#eye-color-g").oninput = (e) => {
        eyeColorG = e.target.value;
        console.log(eyeColorR + ", " + eyeColorG + ", " + eyeColorB);
        eyeColorGLabel.innerText = eyeColorG;
    }
    
    // eye color b
    let eyeColorBLabel = document.querySelector("#color-label-b");
    document.querySelector("#eye-color-b").oninput = (e) => {
        eyeColorB = e.target.value;
        console.log(eyeColorR + ", " + eyeColorG + ", " + eyeColorB);
        eyeColorBLabel.innerText = eyeColorB;
    }
    // eye classes
    leftEye = new eyes.Eyes(ctx,canvasWidth/2 - 80,canvasHeight/2 - 80,40,audioData);
    rightEye = new eyes.Eyes(ctx,canvasWidth/2 + 80,canvasHeight/2 - 80,40,audioData);
}

const draw = (params={}) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    if (params.byteFreq) {
    	analyserNode.getByteFrequencyData(audioData);
    }
    else {
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
    // update eyelid offset
    // eyelids will move depending on the average of all audio data
    // MOVED TO EYELID CLASS
    // eyelidOffset = 0;
    // for (let i = 0; i < audioData.length; i++) {
    //     eyelidOffset += (audioData[i] / 255);
    // }
    // eyelidOffset /= audioData.length;
    //console.log(eyelidOffset);  

	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
    // draw robot head
    ctx.save();
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.roundRect(canvasWidth/4,10,canvasWidth / 2,canvasHeight - 20, 50);
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    // draw robot left eye
    // ctx.save();
    // ctx.fillStyle = eyeGradientL;
    // ctx.beginPath();
    // ctx.arc(canvasWidth/2 - 80,canvasHeight/2 - 80,40,0,2*Math.PI);
    // ctx.fill();
    // ctx.closePath();
    leftEye.update(eyeColorR,eyeColorG,eyeColorB);
    leftEye.draw();

    // right eye
    // ctx.fillStyle = eyeGradientR;
    // ctx.beginPath();
    // ctx.arc(canvasWidth/2 + 80,canvasHeight/2 - 80,40,0,2*Math.PI);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();
    rightEye.update(eyeColorR,eyeColorG,eyeColorB);
    rightEye.draw();

    
    // eyelids left
    // ctx.save();
    // ctx.fillStyle = "gray";
    // ctx.translate(0, -eyelidOffset * 40);
    // ctx.beginPath();
    // ctx.moveTo(280,80);
    // ctx.lineTo(360,80);
    // ctx.lineTo(380,120);
    // ctx.lineTo(260,120);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();
    eyelidLeft.update();
    eyelidLeft.draw();

    // eyelids right
    // ctx.save();
    // ctx.fillStyle = "gray";
    // ctx.translate(0, -eyelidOffset * 40);
    // ctx.beginPath();
    // ctx.moveTo(520,80);
    // ctx.lineTo(440,80);
    // ctx.lineTo(420,120);
    // ctx.lineTo(540,120);
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();
    eyelidRight.update();
    eyelidRight.draw();

	// 3 - draw gradient
	if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
	// 4 - draw bars
	if (params.mouthType == "mouth1") {
        let barSpacing = 0;
        // let margin = 5;
        // let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = 1;
        let barMaxHeight = 70;
        // let topSpacing = 100;

        // ctx.save();
        // ctx.fillStyle = "rgba(255,255,255,0.50)";
        // ctx.strokeStyle = "rgba(0,0,0,0.50)";
        // // loop through the data and draw!
        // for (let i = 0; i < audioData.length; i++) {
        //     ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        //     ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        // }
        // ctx.restore();
        
        ctx.save();
        ctx.fillStyle = "red";
        for (let i = 10; i < audioData.length + 10; i++) {
            ctx.fillRect((canvasWidth / 2) - ((i - 10) * (barWidth + barSpacing)), 
                         300 - ((audioData[i] / 255) * barMaxHeight),
                         barWidth,
                         ((audioData[i] * 2 / 255) * barMaxHeight));

            ctx.fillRect((canvasWidth / 2) + ((i - 10) * (barWidth + barSpacing)), 
                         300 - ((audioData[i] / 255) * barMaxHeight),
                         barWidth,
                         ((audioData[i] * 2 / 255) * barMaxHeight));
        }

        ctx.restore();
    } // other mouth type
    else if (params.mouthType == "mouth2") {
        let maxHeight = 30;
        //console.log("mouth2");
        ctx.save();
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(400 - audioData.length, 300)
        for (let i = 0; i < audioData.length; i+=3) {
            console.log(audioData[audioData.length - i]);
            if(i % 2 == 0) {
                ctx.lineTo(400 - audioData.length + i, 300 - (audioData[audioData.length - i] * maxHeight / 255));
            }
            else {
                ctx.lineTo(400 - audioData.length + i, 300 + (audioData[audioData.length - i] * maxHeight / 255));
            }
        }
        for (let i = 0; i < audioData.length; i+=3) {
            if (i % 2 == 0) {
                ctx.lineTo(400 + i, 300 - (audioData[i] * maxHeight / 255));
            }
            else {
                ctx.lineTo(400 + i, 300 + (audioData[i] * maxHeight / 255));
            }
        }
        ctx.lineTo(400 + audioData.length, 300);
        ctx.lineTo(400 - audioData.length, 300);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
	// // 5 - draw circles
	// if (params.showCircles) {
    //     let maxRadius = canvasHeight / 4;
    //     ctx.save();
    //     ctx.globalAlpha = 0.5;
    //     for (let i = 0; i < audioData.length; i++) {
    //         //red ish circles
    //         let percent = audioData[i] / 255;

    //         let circleRadius = percent * maxRadius;
    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent / 3.0);
    //         ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();

    //         //bluish circles
    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(0, 0, 0, .10 - percent / 10.0);
    //         ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();
            
    //         // yellowish circles, smaller
    //         ctx.save();
    //         ctx.beginPath();
    //         ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
    //         ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.5, 0, 2 * Math.PI, false);
    //         ctx.fill();
    //         ctx.closePath();
    //         ctx.restore();
    //     }
    //     ctx.restore();
    // }

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	// let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    // let data = imageData.data;
    // let length = data.length;
    // let width = imageData.width; // not using here

	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    // for (let i = 0; i < length; i += 4) {
	// 	// C) randomly change every 20th pixel to red
    //     if (params.showNoise && Math.random() < .05) {
	// 		// data[i] is the red channel
	// 		// data[i+1] is the green channel
	// 		// data[i+2] is the blue channel
	// 		// data[i+3] is the alpha channel
	// 		// zero out the red and green and blue channels
	// 		// make the red channel 100% red
    //         data[i] = data[i + 1] = data[i + 2] = 0;
    //         data[i] = 255; // red channel

            
	//     } // end if

    //     // invert? 
    //     if (params.showInvert) {
    //         let red = data[i], green = data[i + 1], blue = data[i + 2];
    //         data[i] = 255 - red; // set red value
    //         data[i + 1] = 255 - green; // set blue value
    //         data[i + 2] = 255 - blue; // set green value
    //         // data[i+3] is the alpha but we're not going to invert that
    //     }
	// } // end for
	
    // if (params.showEmboss) {
    //     for (let i = 0; i < length; i++) {
    //         if (i % 4 == 3) continue; // skip alpha channel
    //         data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
    //     }
    // }
	// // D) copy image data back to canvas
    // ctx.putImageData(imageData, 0, 0);
}

export {setupCanvas,draw};