const axios = require('axios');
const Sharp = require('sharp');

// Returns an image from an imgUrl in array buffer format
const getImageArrayBufferFromUrl = async (imgUrl) => {
    return await axios.get(imgUrl, { responseType: 'arraybuffer'});
}

const resize = async (imgArrBuf) => {
    let w = 200, h = 200;
    let img = await Sharp(imgArrBuf).resize({width: w, height: h}).toFormat('png').toBuffer();
    return true;
}

const rotate = async (imgArrBuf) => {
    let deg = 90;
    let img = await Sharp(imgArrBuf).rotate(deg).toFormat('png').toBuffer();
    return true;
}

const flip = async (imgArrBuf) => {
    let img = await Sharp(imgArrBuf).flip().toFormat('png').toBuffer();
    return true;
}

const convolve = async (imgArrBuf) => {
    let img = await Sharp(imgArrBuf).convolve({
        width: 3,
        height: 3,
        kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1]
      }).toFormat('png').toBuffer();
    return true;
}

const blur = async (imgArrBuf) => {
    let img = await Sharp(imgArrBuf).blur(25).toFormat('png').toBuffer();
    return true;
}

module.exports = {
    getImageArrayBufferFromUrl, 
    resize, 
    rotate, 
    blur, 
    convolve, 
    flip,
}