const axios = require('axios');
const {k8sConf} = require('../config/k8sConf');

class Monitor {

    namespace = null

    constructor(namespace)
    {
        this.namespace = namespace
    }

    getPodCpuUsage = async () => {
        let res = await axios.get(`${k8sConf.proxyUrl}/apis/metrics.k8s.io/v1beta1/pods/`);
        const podMetrics = res.data.items.filter(x => x.metadata.namespace === this.namespace)
        const numPods = podMetrics.length
        let cpuUtization = 0.0
        podMetrics.forEach(pod => {
            pod.containers.forEach(container => {
                cpuUtization += parseInt(container.usage.cpu.match(/-?\d+\.?\d*/))
            })
        });
    
        return {numPods, cpuUtization};
    }
    getCpuUsage = async () => {
        let res = await axios.get(`${k8sConf.proxyUrl}/apis/metrics.k8s.io/v1beta1/pods/`);
        const podMetrics = res.data.items.filter(x => x.metadata.namespace === this.namespace)
        const numPods = podMetrics.length
        let podUtilization = []
        podMetrics.forEach(pod => {
            pod.containers.forEach(container => {
                podUtilization.push(parseInt(container.usage.cpu.match(/-?\d+\.?\d*/)))
            })
        });
        console.log("hello")
        console.log(numPods)
        console.log(podUtilization)
        return {numPods, podUtilization};
    }
    
    getPodMemoryUsage = async () => {
        let res = await axios.get(`${k8sConf.proxyUrl}/apis/metrics.k8s.io/v1beta1/pods/`)
        const podMetrics = res.data.items.filter(x => x.metadata.namespace === this.namespace)
        const numPods = podMetrics.length
        let memoryUtization = 0.0
        podMetrics.forEach(pod => {
            pod.containers.forEach(container => {
                memoryUtization += parseInt(container.usage.memory.match(/-?\d+\.?\d*/))
            })
        });
    
        return {numPods, memoryUtization};
    }
}

module.exports = { 
    Monitor
};