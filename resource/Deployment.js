const fs = require('fs');
const YAML = require('yamljs');
const { kc, k8s } = require('../connection/k8sConn');
const { Pod } = require('./Pod');

class Deployment {
    name = null
    rawDeplObj = null
    k8sDeplObj = null
    templatePath = null
    namespace = null
    pod = null

    constructor(templatePath, name) {
        this.templatePath = templatePath
        this.name = name
    }

    async deploy(namespace){
        this.namespace = namespace
        let content = fs.readFileSync(this.templatePath, {encoding: 'utf-8'});
        this.rawDeplObj = YAML.parse(content);
        this.rawDeplObj.metadata.name = this.name;
        this.rawDeplObj.spec.template.metadata.name = this.name + '-pod';

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

            // Setting Deployment variables
            this.k8sDeplObj = resp.data;
            
            // Setting Pods inside Deployment
            let k8sApi2 = kc.makeApiClient(k8s.CoreV1Api);
            let k8sRes2 = await k8sApi2.listPodForAllNamespaces();
            k8sRes2.body.items.forEach(pd => {
                if(pd.metadata.name.includes(this.name))
                    this.pod = new Pod(pd.metadata.name, pd.status.phase, 250, 100000);
            })

            console.log(this.pod);

            // For polling the status of the pod
            this.pod.pollStatus();
            

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