const { kc, k8s } = require('../connection/k8sConn');

const PodStatus = {
    NONE: 'NONE',
    PENDING: 'Pending',
    RUNNING: 'Running',
    UNKNOWN: 'Unknown',
    SUCCEEDED: 'Succeeded',
    FAILED: 'Failed'
}

class Pod {
    name
    status = PodStatus.NONE
    cpuRequest = null
    memRequest = null

    constructor(name, status, cpuRequest, memRequest)
    {
        this.name = name
        this.status = status
        this.cpuRequest = cpuRequest
        this.memRequest = memRequest
    }

    async pollStatus(){
        let k8sApi2 = kc.makeApiClient(k8s.CoreV1Api)
        let k8sRes2 = await k8sApi2.listPodForAllNamespaces();
        k8sRes2.body.items.forEach(pd => {
            if(pd.metadata.name === this.name)
                if(pd.status.phase !== this.status)
                {
                    this.status = pd.status.phase
                    console.log(this.status);
                }
                
                if(this.status != PodStatus.RUNNING)
                    setTimeout(this.pollStatus, 15000);
        })
    }
}

module.exports = {
    Pod, PodStatus
}