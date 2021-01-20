const { ResourceMap } = require('./resource/ResourceMap');
const { main } = require('./autoscaler/checker');

const config = {
    'namespace':'web-app',
    'initDeplPath': 'deployment_template/depl.yml',
    'initSvcPath': 'deployment_template/svc.yml',
    'initNamespacePath': 'deployment_template/namespace.yml',
}

const run = async () => {
    let resMap = new ResourceMap(config.namespace);
    await resMap.initialDeployment({namespacePath: config.initNamespacePath, deplPath: config.initDeplPath, svcPath: config.initSvcPath});
    main(resMap, 75);
}

run();

