const { Deployment } = require('./Deployment');
const { Service } = require('./Service');
const { kc, k8s } = require('../connection/k8sConn');   
const { PodStatus } = require('./Pod');
const fs = require('fs');
const YAML = require('yamljs');

class ResourceMap {
    deplCounter = 0
    deployments = []
    service = null
    nodes = []

    constructor(namespace) {
        this.namespace = namespace
    }

    async deployNamespace(templatePath) {
        let content = fs.readFileSync(templatePath, {encoding: 'utf-8'});
        content = YAML.parse(content);
        const resp = {
            success: false,
            error: null,
            message: null,
            data: null
        }
        try {
            let k8sApi = kc.makeApiClient(k8s.CoreV1Api);
            let k8sRes = await k8sApi.createNamespace(content);
            resp.success = true;
            resp.message = {status: k8sRes.response.statusCode, statusMessage: k8sRes.response.statusMessage}
            resp.data = k8sRes.body;
        }
        catch (err) {
            resp.success = false;
            resp.error = err;
        }
        console.log(resp)
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
        if (this.deployments.length > 0) {
            let depl = this.deployments[0]
            let resp = await depl.remove(depl.name, this.namespace)
            this.deployments.shift()
            console.log(depl.name, " deleted")
        }
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