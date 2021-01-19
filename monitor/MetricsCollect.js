const axios = require('axios');
const {k8sConf} = require('../config/k8sConf');

const getPodCpuUsage = async (namespace) => {
    let res = await axios.get(`${k8sConf.proxyUrl}/apis/metrics.k8s.io/v1beta1/pods/`);
    const podMetrics = res.data.items.filter(x => x.metadata.namespace === namespace)
    const numPods = podMetrics.length
    let cpuUtization = 0.0
    podMetrics.forEach(pod => {
        pod.containers.forEach(container => {
            cpuUtization += parseInt(container.usage.cpu.match(/-?\d+\.?\d*/))
        })
    });

    return (numPods, cpuUtization);
}

const getPodMemoryUsage = async (namespace) => {
    let res = await axios.get(`${k8sConf.proxyUrl}/apis/metrics.k8s.io/v1beta1/pods/`)
    const podMetrics = res.data.items.filter(x => x.metadata.namespace === namespace)
    const numPods = podMetrics.length
    let memoryUtization = 0.0
    podMetrics.forEach(pod => {
        pod.containers.forEach(container => {
            memoryUtization += parseInt(container.usage.memory.match(/-?\d+\.?\d*/))
        })
    });

    return (numPods, memoryUtization);
}

module.exports = { 
    getPodCpuUsage, 
    getPodMemoryUsage 
};