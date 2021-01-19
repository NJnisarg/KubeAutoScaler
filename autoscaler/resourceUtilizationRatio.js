const resourceUtilizationRatio = (Usage,request,targetUtilization) => {
    currentUtilization = (Usage*100)/request
    return float(currentUtilization)/float(targetUtilization)
}

module.exports = {
    resourceUtilizationRatio
}