const  { resourceUtilizationRatio } = require('./resourceUtilizationRatio');
const { decision } = require('./decision');
const { ARIMAScaler } = require('./arima');
const Controller = require('node-pid-controller');
const fs = require('fs');

// let ctr = new Controller({
//     k_p: 0.04,
//     k_i: 0.0,
//     k_d: 0.0,
// });

let ctr = new Controller({
    k_p: 0.6*0.015,
    k_i: 1.2*0.015/10,
    k_d: 0.075*0.015*10,
});

ctr.setTarget(75);

let arimaModel = new ARIMAScaler();
let prevCPU = 0

const main = (resMap, targetUtilization) => {
    check(resMap, targetUtilization);
    setTimeout(main, 20000, resMap, targetUtilization);
}

let prevUtil = 0

const check = async (resMap,targetUtilization) => {
    let { numPods, cpuUtization } = await resMap.monitor.getPodCpuUsage();
    let np = resMap.getCPURequests().numPods;

    // Smoothening data
    if(np !== numPods && np > numPods)
    {
        let podDiff = np - numPods;
        if(prevUtil > 0)
            cpuUtization += (podDiff*300*prevUtil);
        else
            cpuUtization += (podDiff*300*0.5);
        numPods+=podDiff;
        console.log("PodDiff", podDiff);
    }
    let totalRequest = numPods * 300; // Set in the deployment
    fs.appendFileSync('cpuVal.txt', `${cpuUtization/totalRequest*100},${numPods}\n`, {encoding:'utf-8'});

    arimaModel.arimaUpdate(cpuUtization)

    console.log("Original CPU: ", cpuUtization)

    if(arimaModel.isArima) {
        predUtization = arimaModel.arimaPredict();
        console.log("Predicted CPU: ", predUtization)
        console.log("Error: ",cpuUtization - prevCPU)
        prevCPU = predUtization
        cpuUtization = predUtization
        fs.appendFileSync("cpu.txt", cpuUtization + '\n');
    }

    console.log("Check:", cpuUtization, numPods, totalRequest);

    let ratio = resourceUtilizationRatio(cpuUtization,totalRequest,targetUtilization);

    let value = decision(ratio, numPods);
    let diff = Math.ceil(value - numPods);

    console.log("DIFF:", diff);


    if (numPods > 0 && cpuUtization > 0) {
        console.log(ctr);
        let value1 = ctr.update(cpuUtization/totalRequest*100);
        let diff1 = -1 * Math.round(value1);
        console.log("DIFF 1: ", diff1);

        diff = Math.round(0.8*diff + 0.2*diff1)
    }

    prevUtil = cpuUtization/totalRequest;
    console.log("FInal DIFF: ", diff)

    if(diff>0){
        for(let i=0;i<diff;i++){
            await resMap.deployNewDeployment()
        }
    }
    else{
        diff = Math.max(Math.abs(Math.ceil(diff/2)), 0)
        if(diff >= numPods)
        {
            for(let i=0;i<numPods-1;i++){
                await resMap.removeDeployment()
            }
        }
        else{
            for(let i=0;i<diff;i++){
                await resMap.removeDeployment()
            }
        }
    }
}

module.exports = {
    main
}