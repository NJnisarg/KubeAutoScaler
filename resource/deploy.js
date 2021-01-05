const { kc, k8s } = require('../connection/k8sConn');

class Deploy {

    deplId = null
    deplObj = null
    deplRes = null
    namespace = null


    constructor(deplId, deplObj, namespace){

        this.deplId = deplId
        this.deplObj = deplObj
        this.namespace = namespace
    }

    async deploy(){
        const resp = {
            success: false,
            error: null,
            message: null,
            data: null
        }
        try{
            let k8sApi = kc.makeApiClient(k8s.AppsV1Api)
            let k8sRes = await k8sApi.createNamespacedDeployment(this.namespace, this.deplObj);

            resp.success = true;
            resp.message = {status: k8sRes.response.statusCode, statusMessage: k8sRes.response.statusMessage}
            resp.data = k8sRes.body;
            this.deplRes = resp.data;

        }catch(err)
        {
            resp.success = false;
            resp.error = err;
        }

        return resp;
    }
}

class SVCDeploy extends Deploy {
    async deploy() {
        const resp = {
        success: false,
        error: null,
        message: null,
        data: null
        }
        try{
            let k8sApi = kc.makeApiClient(k8s.CoreV1Api)
            let k8sRes = await k8sApi.createNamespacedService(this.namespace, this.deplObj);

            resp.success = true;
            resp.message = {status: k8sRes.response.statusCode, statusMessage: k8sRes.response.statusMessage}
            resp.data = k8sRes.body;
            this.deplRes = resp.data;

        }catch(err)
        {
            resp.success = false;
            resp.error = err;
        }

        return resp;
    }
}

module.exports = {
    Deploy, 
    SVCDeploy
}