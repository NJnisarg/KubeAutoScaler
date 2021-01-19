const { Deployment } = require('./Deployment');
const { Service } = require('./Service');
const { kc, k8s } = require('../connection/k8sConn');   
const { PodStatus } = require('./Pod');

class ResourceMap {
    deplCounter = 0
    deployments = []
    service = null
    nodes = []

    constructor(namespace) {
        this.namespace = namespace
    }

    async deployNamespace(templatePath) {

    }

    async deploySvc(templatePath) {
        let svc = new Service(templatePath);
        let resp = await svc.deploy(this.namespace);
        this.service = svc;
    }

    async deployNewDeployment (templatePath) {
        let depl = new Deployment(templatePath, this.namespace + `-depl-${this.deplCounter}`);
        let resp = await depl.deploy(this.namespace);
        this.deployments.push(depl);
        this.deplCounter += 1;
    }

    async removeDeployment () {

    }

    async getCPURequests () {
        let totalRequest = 0; // Only consider ready pods
        let numPods = 0; // Ready + Unready both
        this.deployments.forEach(depl => {
            if(depl.pod.status === PodStatus.RUNNING)
            {
                totalRequest += depl.pod.cpuRequest;
                numPods+=1;
            }
        })  

        return (numPods, totalRequest);
    }

    async getMemoryRequests () {
        let totalRequest = 0; // Only consider ready pods
        let numPods = 0; // Ready + Unready both
        this.deployments.forEach(depl => {
            if(depl.pod.status === PodStatus.RUNNING)
            {
                totalRequest += depl.pod.memRequest;
                numPods+=1;
            }
        })  

        return (numPods, totalRequest);
    }

    async addNode () {

    }

    async initialDeployment(templatePaths) {
        let {namespacePath, deplPath, svcPath} = templatePaths
        await this.deployNamespace(namespacePath);
        await this.deployNewDeployment(deplPath)
        await this.deploySvc(svcPath)
        return true
    }
}

module.exports = {
    ResourceMap
}