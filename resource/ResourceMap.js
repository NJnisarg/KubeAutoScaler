const { Deployment } = require('./Deployment');
const { Service } = require('./Service');

class ResourceMap {
    deployments = []
    service = null
    nodes = []
    pods = []

    constructor() {

    }

    async deploySvc(templatePath, namespace) {
        let svc = new Service(templatePath);
        let resp = await svc.deploy(namespace);
        this.service = svc;
    }

    async deployNewDeployment (templatePath, namespace) {
        let depl = new Deployment(templatePath);
        let resp = await depl.deploy(namespace);
        this.deployments.push(depl);
    }

    async addNode () {

    }

    async initialDeployment() {

    }
}

module.exports = {
    ResourceMap
}