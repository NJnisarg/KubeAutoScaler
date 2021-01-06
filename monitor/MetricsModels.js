class CPUMetrics {

    resouceType
    resourceId
    resourceName
    TSKey

    constructor(resouceType, resourceId, resourceName){
        this.resouceType = resouceType
        this.resourceId = resourceId
        this.resourceName = resourceName
        this.TSKey = `CPU_${this.resouceType}_${this.resourceName}_${this.resourceId}`
    }

    getUsage(){

    }

    TSLogUsage() {

    }

    TSGetUsage() {

    }



}

class MemMetrics {

    resouceType
    resourceId
    resourceName
    TSKey

    constructor(resouceType, resourceId, resourceName){
        this.resouceType = resouceType
        this.resourceId = resourceId
        this.resourceName = resourceName
        this.TSKey = `Mem_${this.resouceType}_${this.resourceName}_${this.resourceId}`
    }

    getUsage(){

    }

    TSLogUsage() {

    }

    TSGetUsage() {
        
    }
}

module.exports = {
    CPUMetrics, MemMetrics
}