// no changes needed in this file.
const readAppData = (callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '../data/av-data.json', true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      callback(data);
    } else {
      console.error('Error reading the shape data');
    }
  };

  xhr.onerror = () => {
    console.error('Request failed');
  };

  xhr.send();
}

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };

  const getRadialGradient = (ctx,x1,y1,innerRadius,x2,y2,outerRadius,colorStops) => {
    let rg = ctx.createRadialGradient(x1,y1,innerRadius,x2,y2,outerRadius);
    for(let stop of colorStops){
      rg.addColorStop(stop.percent,stop.color);
    }
    return rg;
  };
  
  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
  const goFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
  };
  
  

  

  export {makeColor, getRandomColor, getLinearGradient, getRadialGradient, goFullscreen, readAppData};