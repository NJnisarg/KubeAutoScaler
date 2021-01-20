const resourceUtilizationRatio = (Usage,request,targetUtilization) => {
    currentUtilization = Usage/request
    return currentUtilization/targetUtilization
}

module.exports = {
    resourceUtilizationRatio
}