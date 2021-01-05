const fs = require('fs');
const YAML = require('yamljs');

class deployObj {
    depl
    templatePath

    constructor(templatePath){
        this.templatePath = templatePath
        let content = fs.readFileSync(templatePath, {encoding: 'utf-8'});
        this.depl = YAML.parse(content);
    }
}

module.exports = {
    deployObj
}