const fs = require('fs');
const YAML = require('yamljs');
const { kc, k8s } = require('../connection/k8sConn');
const { CPUMetrics, MemMetrics } = require('../monitor/MetricsModels');
const { resourceTypes } = require('./ResourceType')

class Deployment {
    name = null
    deplId = null
    rawDeplObj = null
    k8sDeplObj = null
    cpuMetrics = null
    memMetrics = null
    templatePath = null
    namespace = null

    constructor(templatePath) {
        this.templatePath = templatePath
    }

    async deploy(namespace){
        this.namespace = namespace
        let content = fs.readFileSync(this.templatePath, {encoding: 'utf-8'});
        this.rawDeplObj = YAML.parse(content);

        const resp = {
            success: false,
            error: null,
            message: null,
            data: null
        }
        try{
            let k8sApi = kc.makeApiClient(k8s.AppsV1Api)
            let k8sRes = await k8sApi.createNamespacedDeployment(this.namespace, this.rawDeplObj);

            resp.success = true;
            resp.message = {status: k8sRes.response.statusCode, statusMessage: k8sRes.response.statusMessage}
            resp.data = k8sRes.body;
            this.k8sDeplObj = resp.data;
            this.deplId = null
            this.name = null
            this.cpuMetrics = new CPUMetrics(resourceTypes.DEPL, this.deplId, this.name)
            this.memMetrics = new MemMetrics(resourceTypes.DEPL, this.deplId, this.name)
            

        }catch(err)
        {
            resp.success = false;
            resp.error = err;
        }

        return resp;

    }
}

module.exports = {
    Deployment
}