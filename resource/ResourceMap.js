const { Deployment } = require('./Deployment');
const { Service } = require('./Service');
const { kc, k8s } = require('../connection/k8sConn');   
const { V1LabelSelector } = require('@kubernetes/client-node');

class ResourceMap {
    deployments = []
    service = null
    nodes = []
    pods = []

    constructor(namespace) {
        this.namespace = namespace
    }

    async deploySvc(templatePath) {
        let svc = new Service(templatePath);
        let resp = await svc.deploy(this.namespace);
        this.service = svc;
    }

    async deployNewDeployment (templatePath) {
        let depl = new Deployment(templatePath);
        // let resp = await depl.deploy(this.namespace);
        // this.deployments.push(depl);

        let k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        const re = await k8sApi.listPodForAllNamespaces(undefined, undefined, undefined, 'web-app');
        console.log(re.body);

    }

    async removeDeployment () {

    }

    async getDeplCPURequests () {

    }

    async getDeplMemoryRequests () {

    }

    async addNode () {

    }

    async initialDeployment(templatePaths) {
        let {deplPath, svcPath} = templatePaths
        await this.deployNewDeployment(deplPath)
        // await this.deploySvc(svcPath)
        return true
    }
}

module.exports = {
    ResourceMap
}