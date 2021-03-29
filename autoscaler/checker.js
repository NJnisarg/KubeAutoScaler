const  { resourceUtilizationRatio } = require('./resourceUtilizationRatio');
const { decision } = require('./decision');
const {ARIMAScaler} = require('./ARIMA_PID/arima');

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
        if(cpuUtization/totalRequest < 40)
        {
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
}

const arimaCheck = async (resMap,targetUtilization) => {
    let { cpuUtization } = await resMap.monitor.getPodCpuUsage();
    let {numPods, totalRequest} = resMap.getCPURequests();

    let arimaModel = new ARIMAScaler(cpuUtization);
    let predictedUtil = arimaModel.arimaCPUChecker();

    let ratio = resourceUtilizationRatio(predictedUtil,totalRequest,targetUtilization);

    let value = decision(ratio, numPods);
    let diff = Math.ceil(value - numPods);

    console.log("DIFF:", diff);

    if(diff>0){
        for(let i=0;i<diff;i++){
            await resMap.deployNewDeployment()
        }
    }
    else{
        if(cpuUtization/totalRequest < 40)
        {
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

    arimaModel.arimaUpdate(cpuUtization);
}

module.exports = {
    main
}