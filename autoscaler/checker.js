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
    let diff = Math.floor(value - numPods);

    console.log("DIFF:", diff);

    if(diff>0){
        for(let i=0;i<diff;i++){
            resMap.deployNewDeployment()
        }
    }
    else{
        if(numPods > 1)
        {
            for(let i=0;i<Math.abs(diff);i++){
                resMap.removeDeployment()
            }
        }
    }
}

module.exports = {
    main
}