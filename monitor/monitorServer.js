var express = require('express');
var cors = require('cors');
const {loadProfileArr, randomIntFromInterval } = require('./Monitor');
const {ARIMAScaler} = require('../autoscaler/ARIMA_PID/arima');

const loadArr = loadProfileArr();
let cpuUsageArr = null;
let arimaScaler = null;

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let usageArr = [];
let mxPods = 100
let mxRPS = 0;

for(let i=0; i<loadArr.length;i+=1)
{
    if(loadArr[i] > mxRPS)
        mxRPS = loadArr[i];    
}
for(let i=0; i<loadArr.length;i+=1)
{
    usageArr.push(Math.floor(mxPods*loadArr[i]/mxRPS) + randomIntFromInterval(-10,10) - 10)
}
if(cpuUsageArr === null)
    cpuUsageArr = usageArr;

if(arimaScaler===null)
{
    arimaScaler = new ARIMAScaler(cpuUsageArr);
}

app.use('/getCPUUsage', async (req, res, next) => {
    res.json({usageArr: cpuUsageArr}).status(200);

});

app.use('/getNumPods', (req, res, next) => {
    let numPodsArr = []
    let mxPods = 4
    let mxRPS = 0;
    
    for(let i=0; i<loadArr.length;i+=1)
    {
        if(loadArr[i] > mxRPS)
            mxRPS = loadArr[i];    
    }
    for(let i=0; i<loadArr.length;i+=1)
    {
        numPodsArr.push(Math.floor(mxPods*loadArr[i]/mxRPS))
    }
    res.json({numPodsArr}).status(200);
})

app.use('/getRespTime', (req, res, next) => {
    let respTimeArr = []
    let base = 400
    for(let i=0; i<loadArr.length;i+=1)
    {
        respTimeArr.push(base + randomIntFromInterval(0, 40))
    }
    res.json({respTimeArr}).status(200);
})

app.use('/getRPS', (req,res,next) => {
    res.json({loadArr}).status(200);
})

app.use('/getForecastedCPU', async (req, res, next) => {
    res.json({pred:arimaScaler.arimaCPUChecker()[0]}).status(200);
});

app.use('/updateArima', (req, res, next) => {
    let val = req.query.val;
    arimaScaler.arimaUpdate(val);
    res.json({success:true}).status(200);
});

module.exports = app;
