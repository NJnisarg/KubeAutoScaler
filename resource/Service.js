const fs = require('fs');
const YAML = require('yamljs');
const { kc, k8s } = require('../connection/k8sConn');
const { CPUMetrics, MemMetrics } = require('../monitor/MetricsModels');
const { resourceTypes } = require('./ResourceType')

class Service {
    name = null
    svcId = null
    rawSvcObj = null
    k8sSvcObj = null
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
        this.rawSvcObj = YAML.parse(content);

        const resp = {
            success: false,
            error: null,
            message: null,
            data: null
        }
        try{
            let k8sApi = kc.makeApiClient(k8s.CoreV1Api)
            let k8sRes = await k8sApi.createNamespacedService(this.namespace, this.rawSvcObj);

            resp.success = true;
            resp.message = {status: k8sRes.response.statusCode, statusMessage: k8sRes.response.statusMessage}
            resp.data = k8sRes.body;
            this.k8sSvcObj = resp.data;
            this.svcId = null
            this.name = null
            this.cpuMetrics = new CPUMetrics(resourceTypes.SVC, this.svcId, this.name)
            this.memMetrics = new MemMetrics(resourceTypes.SVC, this.svcId, this.name)
            

        }catch(err)
        {
            resp.success = false;
            resp.error = err;
        }

        return resp;

    }
}

module.exports = {
    Service
}