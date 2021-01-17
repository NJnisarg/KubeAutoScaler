const axios = require('axios');

const getUsage = async () => {
    let res = await axios.get('http://127.0.0.1:8080/apis/metrics.k8s.io/v1beta1/pods/')
    let app_pod_metrics = res.data.items.find(x => x.metadata.namespace === "web-app").containers
    console.log(app_pod_metrics)
}

getUsage();