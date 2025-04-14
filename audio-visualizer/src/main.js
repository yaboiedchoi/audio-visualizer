/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as audio from './audio.js';
import * as utils from './utils.js';
import * as canvas from './canvas.js';
// OLD
// import * as jsonReader from './json-reader.js';

const drawParams = {
  showGradient : false,
  showBars : true,
  showCircles : false, 
  showNoise : false,
  showInvert : false,
  showEmboss : false,
  byteFreq : true,
  mouthType : "mouth1",
  voiceType : "voice2",
}

// fps
const fps = 60;

// json
let json;

// audio object
let audioPathList = [];

// 1 - here we are faking an enumeration
const DEFAULTS = {
};

utils.readAppData(json => {
  // set default song paths
  DEFAULTS.sound1 = json["audio"]["1"]["path"];
  DEFAULTS.sound2 = json["audio"]["1"]["path"];
  DEFAULTS.sound3 = json["audio"]["1"]["path"];
  // set default values

  // title
  document.title = json.title;
  document.querySelector("#title").innerHTML = json.title;

  // volume
  // console.log(json["default-slider-values"].volume);
  document.querySelector("#volume-slider").value = json["default-values"].volume;
  document.querySelector("#volume-label").innerHTML = Math.round(json["default-values"].volume / 2 * 100);
  
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");
  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update the label to match the value
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  }

  // path
  // console.log(json["audio"]["1"]);
  for (let key in json["audio"]){
    DEFAULTS["sound" + key] = json["audio"][key]["path"];
  }
  console.log(DEFAULTS);
})

const init = () => {
//   // load and parse the JSON file
//   loadJson();

	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	audio.setupWebAudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);

  loop();
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fs-btn");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };
	
  // add .onclick event to button
  const playButton = document.querySelector("#play-btn")
  playButton.onclick = e => {
    console.log(`audioCtx.state before = $(audio.audioCtx.state)`);

    // check if context is in suspended state (autoplay policy)
    if(audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = $(audio.audioCtx.state)`);
    if (e.target.dataset.playing == "no") {
      // if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
      // if track IS playing, pause it
    } 
    else {
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
    }

    // C - hookup volume slider & label
    let volumeSlider = document.querySelector("#volume-slider");
    // let volumeLabel = document.querySelector("#volume-label");
    // // add .oninput event to slider
    // volumeSlider.oninput = e => {
    //   // set the gain
    //   audio.setVolume(e.target.value);
    //   // update the label to match the value
    //   volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    // }

    // set the value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    // D - hookup track <select>
    let trackSelect = document.querySelector("#track-select");
    // add .onchange event to <select>
    trackSelect.onchange = e => {
      audio.loadSoundFile(e.target.value);
      // pause the current track if it is playing
      if (playButton.dataset.playing = "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
      }
    }
  }

  // // E - hookup showGradient checkbox
  // let showGradientCheckbox = document.querySelector("#gradient-cb");
  // // add .onchange event to checkbox
  // showGradientCheckbox.onchange = e => {
  //   drawParams.showGradient = e.target.checked;
  // }
  // // F - hookup showBars checkbox
  // let showBarsCheckbox = document.querySelector("#bars-cb");
  // // add .onchange event to checkbox
  // showBarsCheckbox.onchange = e => {
  //   drawParams.showBars = e.target.checked;
  // }

  // // G - hookup showCircles checkbox
  // let showCirclesCheckbox = document.querySelector("#circles-cb");
  // // add .onchange event to checkbox
  // showCirclesCheckbox.onchange = e => {
  //   drawParams.showCircles = e.target.checked;
  // }

  // // H - hookup showNoise checkbox
  // let showNoiseCheckbox = document.querySelector("#noise-cb");
  // // add .onchange event to checkbox
  // showNoiseCheckbox.onchange = e => {
  //   drawParams.showNoise = e.target.checked;
  // }

  // // I - hookup showInvert checkbox
  // let showInvertCheckbox = document.querySelector("#invert-cb");
  // // add .onchange event to checkbox
  // showInvertCheckbox.onchange = e => {
  //   drawParams.showInvert = e.target.checked;
  // }

  // // J - hookup showEmboss checkbox
  // let showEmbossCheckbox = document.querySelector("#emboss-cb");
  // // add .onchange event to checkbox
  // showEmbossCheckbox.onchange = e => {
  //   drawParams.showEmboss = e.target.checked;
  // }

  // K - hookup use byte frequency data checkbox
  let useByteFrequencyDataCheckbox = document.querySelector("#byte-freq");
  // add .onchange event to checkbox
  useByteFrequencyDataCheckbox.onchange = e => {
    drawParams.byteFreq = e.target.checked;
  }

  // L - hookup mouth type
  let mouthTypeSelect = document.querySelector("#mouth-select");
  // add .onchange event to select
  mouthTypeSelect.onchange = e => {
    drawParams.mouthType = e.target.value;
  }

  // // M - hookup high shelf checkbox
  // let highShelfCheckbox = document.querySelector("#high-shelf");
  // // add .onchange event to checkbox
  // highShelfCheckbox.onchange = e => {
  //   drawParams.highShelf = e.target.checked;
  //   toggleHighshelf();
  // }

  // // N - hookup low shelf checkbox
  // let lowShelfCheckbox = document.querySelector("#low-shelf");
  // // add .onchange event to checkbox
  // lowShelfCheckbox.onchange = e => {
  //   drawParams.lowShelf = e.target.checked;
  //   toggleLowshelf();
  // }

  // // O - hookup distortion checkbox
  // let distortionCheckbox = document.querySelector("#distortion");
  // // add .onchange event to checkbox
  // distortionCheckbox.onchange = e => {
  //   drawParams.distortion = e.target.checked;
  // }

  // P - hookup voice type
  let voiceTypeSelect = document.querySelector("#voice-select");
  // add .onchange event to select
  voiceTypeSelect.onchange = e => {
    drawParams.voiceType = e.target.value;
    console.log(drawParams.voiceType);
    switch (drawParams.voiceType) {
      case "voice1":
        toggleHighshelf(false);
        toggleLowshelf(true);
        break;
      case "voice2":
        toggleLowshelf(false);
        toggleHighshelf(false);
        break;
      case "voice3":
        toggleLowshelf(false);
        toggleHighshelf(true);
        break;
    }
  }
} // end setupUI

const loop = () => {
  /* NOTE: This is temporary testing code that we will delete in Part II */
    //requestAnimationFrame(loop, 1000/fps);
    setTimeout(loop, 1000/fps);
    // 1) create a byte array (values of 0-255) to hold the audio data
    // normally, we do this once when the program starts up, NOT every frame
    // let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
    
    // 2) populate the array of audio data *by reference* (i.e. by its address)
    // audio.analyserNode.getByteFrequencyData(audioData);
    
    // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
    //  console.log(audioData);
      
    //  console.log("-----Audio Stats-----");
    //  let totalLoudness =  audioData.reduce((total,num) => total + num);
    //  let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
    //  let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
    //  let maxLoudness =  Math.max(...audioData); // ditto!
      // Now look at loudness in a specific bin
      // 22050 kHz divided by 128 bins = 172.23 kHz per bin
      // the 12th element in array represents loudness at 2.067 kHz
    //  let loudnessAt2K = audioData[11]; 
    //  console.log(`averageLoudness = ${averageLoudness}`);
    //  console.log(`minLoudness = ${minLoudness}`);
    //  console.log(`maxLoudness = ${maxLoudness}`);
    //  console.log(`loudnessAt2K = ${loudnessAt2K}`);
    //  console.log("---------------------");
    canvas.draw(drawParams);
  }

const toggleHighshelf = (status) => {
  if (status) {
    console.log("highshelf on");
    audio.biquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.biquadFilter.gain.setValueAtTime(10, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.gain.setValueAtTime(-20, audio.audioCtx.currentTime);
  }
  else {
    console.log("highshelf off");
    audio.biquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
}

const toggleLowshelf = (status) => {
  if (status) {
    console.log("lowshelf on");
    audio.biquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.biquadFilter.gain.setValueAtTime(-20, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.frequency.setValueAtTime(1000, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.gain.setValueAtTime(10, audio.audioCtx.currentTime);
  }
  else {
    console.log("lowshelf off");
    audio.biquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
    audio.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.audioCtx.currentTime);
  }
}

export {init};