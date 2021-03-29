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
        const numPods = podMetrics.length;
        let cpuUtization = 0.0
        podMetrics.forEach(pod => {
            pod.containers.forEach(container => {
                cpuUtization += parseInt(container.usage.cpu.match(/-?\d+\.?\d*/))
            })
        });
    
        return {numPods, cpuUtization};
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

const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const loadProfileArr = () => {
    let loadArr = []
    let ranges  = [[40,45],[42,47],[45,53],[50,57],[55,60]]
    let limit = 500
    let numRanges = ranges.length
    for(let i=0;i<limit;i+=1)
    {
        let rangeIdx = Math.floor(i/limit*numRanges)
        let rps = randomIntFromInterval(ranges[rangeIdx][0], ranges[rangeIdx][1]);
        loadArr.push(rps)
    }

    return loadArr;
}

module.exports = { 
    Monitor,
    loadProfileArr,
    randomIntFromInterval,
};