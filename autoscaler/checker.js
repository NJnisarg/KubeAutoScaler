const  { resourceUtilizationRatio } = require('./resourceUtilizationRatio');
const { decision } = require('./decision');

const main = (resMap, targetUtilization) => {
    check(resMap, targetUtilization);
    setTimeout(main, 10000, resMap, targetUtilization);
}

const check = async (resMap,targetUtilization) => {
    let { cpuUtization } = await resMap.monitor.getPodCpuUsage();
    let {numPods, totalRequest} = resMap.getCPURequests();

    console.log("Check:", cpuUtization, numPods, totalRequest);

    let ratio = resourceUtilizationRatio(cpuUtization,totalRequest,targetUtilization);

    let value = decision(ratio, numPods);
    let diff = Math.ceil(value - numPods);

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