const { Deployment } = require('./Deployment');
const { Service } = require('./Service');

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
        let resp = await depl.deploy(this.namespace);
        this.deployments.push(depl);
    }

    async addNode () {

    }

    async initialDeployment(templatePaths) {
        let {deplPath, svcPath} = templatePaths
        await this.deployNewDeployment(deplPath)
        await this.deploySvc(svcPath)
        return true
    }
}

module.exports = {
    ResourceMap
}