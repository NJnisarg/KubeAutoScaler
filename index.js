const { ResourceMap } = require('./resource/ResourceMap');

const config = {
    'namespace':'web-app',
    'initDeplPath': 'deployment_template/depl.yml',
    'initSvcPath': 'deployment_template/svc.yml',
    'initNamespacePath': '',
}

const run = async () => {
    let resMap = new ResourceMap(config.namespace);
    await resMap.initialDeployment({namespacePath: config.initNamespacePath, deplPath: config.initDeplPath, svcPath: config.initSvcPath});
}

run();

