const axios = require('axios');

const getPodCpuUsage = async (namespace) => {
    let res = await axios.get('http://127.0.0.1:8080/apis/metrics.k8s.io/v1beta1/pods/')
    const podMetrics = res.data.items.filter(x => x.metadata.namespace === namespace)
    const numPods = podMetrics.length
    let cpuUtization = 0.0
    podMetrics.forEach(pod => {
        pod.containers.forEach(container => {
            cpuUtization += parseInt(container.usage.cpu.match(/-?\d+\.?\d*/))
        })
    });

    return cpuUtization/numPods
}

const getPodMemoryUsage = async (namespace) => {
    let res = await axios.get('http://127.0.0.1:8080/apis/metrics.k8s.io/v1beta1/pods/')
    const podMetrics = res.data.items.filter(x => x.metadata.namespace === namespace)
    const numPods = podMetrics.length
    let memoryUtization = 0.0
    podMetrics.forEach(pod => {
        pod.containers.forEach(container => {
            memoryUtization += parseInt(container.usage.memory.match(/-?\d+\.?\d*/))
        })
    });

    return memoryUtization/numPods
}

module.exports = { 
    getPodCpuUsage, 
    getPodMemoryUsage 
};