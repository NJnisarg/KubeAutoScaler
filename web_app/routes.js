const express = require('express');
const controllers = require('./controllers');

const routing = express.Router();

routing.post('/imageResize', controllers.imageResize);
routing.post('/imageRotate', controllers.imageRotate);
routing.post('/imageFlip', controllers.imageFlip);
routing.post('/imageBlur', controllers.imageBlur);
routing.post('/imageConvolve', controllers.imageConvolve);

module.exports = routing;
