const Controller = require('node-pid-controller');
const  { resourceUtilizationRatio } = require('./resourceUtilizationRatio');
const { decision } = require('./decision');
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

const main = (resMap, targetUtilization) => {
    check(resMap, targetUtilization);
    setTimeout(main, 30000, resMap, targetUtilization);
}

const check = async (resMap,targetUtilization) => {
    let { cpuUtization } = await resMap.monitor.getPodCpuUsage();
    let {numPods, totalRequest} = resMap.getCPURequests();

    console.log("Check:", cpuUtization, numPods, totalRequest);

    if(numPods == 0)
        return;
    // let ratio = resourceUtilizationRatio(cpuUtization,totalRequest,targetUtilization);

    // let value = decision(ratio, numPods);
    // let diff = Math.ceil(value - numPods);
    console.log(ctr);
    let value = ctr.update(cpuUtization/totalRequest*100);
    fs.appendFileSync('cpuVal.txt', `${cpuUtization/totalRequest*100},${numPods}\n`, {encoding:'utf-8'});
    let diff = -1 * Math.round(value);
    console.log("DIFF:", diff);

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