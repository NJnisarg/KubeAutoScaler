const {getImageArrayBufferFromUrl, rotate, resize, blur, flip, convolve} = require('./lib');

const imageRotate = async (req, res, next) => {
    let {imgUrl} = req.body;
    let { data } = await getImageArrayBufferFromUrl(imgUrl);
    let processedImg = await rotate(data);
    res.json({
        processedImg 
    });

}

const imageFlip = async (req, res, next) => {
    let {imgUrl} = req.body;
    let { data } = await getImageArrayBufferFromUrl(imgUrl);
    let processedImg = await flip(data);
    res.json({
        processedImg 
    });
}

const imageResize = async (req, res, next) => {
    let {imgUrl} = req.body;
    let { data } = await getImageArrayBufferFromUrl(imgUrl);
    let processedImg = await resize(data);
    res.json({
        processedImg 
    });
}

const imageBlur = async (req, res, next) => {
    let {imgUrl} = req.body;
    let { data } = await getImageArrayBufferFromUrl(imgUrl);
    let processedImg = await blur(data);
    res.json({
        processedImg 
    });
}

const imageConvolve = async (req, res, next) => {
    let {imgUrl} = req.body;
    let { data } = await getImageArrayBufferFromUrl(imgUrl);
    let processedImg = await convolve(data);
    res.json({
        processedImg 
    });
}

module.exports = {
    imageRotate, 
    imageResize, 
    imageBlur, 
    imageConvolve, 
    imageFlip
}