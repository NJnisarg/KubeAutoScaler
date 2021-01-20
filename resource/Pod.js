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
}

const pollPodStatus = async (pod) => {
    console.log(`${pod.name}:`, pod.status);
    let k8sApi2 = kc.makeApiClient(k8s.CoreV1Api);
    let k8sRes2 = await k8sApi2.listPodForAllNamespaces();
    k8sRes2.body.items.forEach(pd => {
        if(pd.metadata.name === pod.name)
            if(pd.status.phase !== pod.status)
                pod.status = pd.status.phase

    })
    setTimeout(pollPodStatus, 10000, pod);
}

module.exports = {
    Pod, PodStatus, pollPodStatus
}