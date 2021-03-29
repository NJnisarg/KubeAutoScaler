const { ResourceMap } = require('./resource/ResourceMap');
const { main } = require('./autoscaler/checker');
// const fs = require('fs');
// const fastcsv = require('fast-csv');

const config = {
    'namespace':'web-app',
    'initDeplPath': 'deployment_template/depl.yml',
    'initSvcPath': 'deployment_template/svc.yml',
    'initNamespacePath': 'deployment_template/namespace.yml',
}

const threshold = 75

const run = async () => {
    let resMap = new ResourceMap(config.namespace);
    await resMap.initialDeployment({namespacePath: config.initNamespacePath, deplPath: config.initDeplPath, svcPath: config.initSvcPath});
    main(resMap, threshold);
}

run();

// const txtToCsv = () => {
//     let content = fs.readFileSync('/home/njnisarg/KubeAutoScaler/loadProfile.txt', {encoding:'utf-8'});
//     content = content.split("\n");

//     let data = [];
//     for(let i=0; i<content.length;i+=1)
//     {
//         data.push({Time:10*(i+1), CPU:content[i]});
//     }

//     const ws = fs.createWriteStream('/home/njnisarg/KubeAutoScaler/loadProfile.csv');
//     fastcsv
//     .write(data, { headers: true })
//     .pipe(ws);
// }

// txtToCsv();