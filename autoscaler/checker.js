const cpuUtilization = require('../monitor/MetricsCollect')
const resourceUtilization = require('./resourceUtilization')
const getCPURequests = require('../resource/ResourceMap')
const decision = require('./decision')
const check = (resMap,targetUtilization) => {
    let cpuUsage = cpuUtilization(resMap.namespace)
    let request = resMap.getCPURequests()
    ratio = resourceUtilizationRatio(cpuUsage,request[1],targetUtilization)
    value = decision(ratio,request[0])
    let diff = value - request[0]
    if(diff>0){
        for(let i=0;i<diff;i++){
            resMap.deployNewDeployment()
        }
    }
    else{
        for(let i=0;i<Math.abs(diff);i++){
            resMap.removeDeployment()
        }
    }
}
module.exports = {
    check
}