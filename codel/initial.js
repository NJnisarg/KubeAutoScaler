let params = {
    interval:1,
    drop_state:0
}
const main = (resMap, targetUtilization) => {
    check(resMap, targetUtilization,params);
    setTimeout(main,120000/Math.sqrt(params.interval), resMap, targetUtilization);
}

const check = async (resMap,targetUtilization,params) => {
    let cpuUtilization = []
    let minUtilization = 35
    const fs = require('fs');
    let { cpuUtization } = await resMap.monitor.getPodCpuUsage();
    cpuUtilization = await resMap.monitor.getCpuUsage();
    fs.appendFileSync("cpu1.txt",cpuUtization + '\n');
    console.log(fs.readFileSync("cpu1.txt", "utf8"));
    let {numPods, totalRequest} = resMap.getCPURequests();
    console.log("total requests",totalRequest);
    console.log("interval",params.interval);
    console.log("number of pods",numPods);
    if(numPods==0){
        console.log("Creating a container",numPods+1);
        setTimeout(main,30000, resMap, targetUtilization);
    }
    else{
        let flag=0;
        let min_flag = 0;
        console.log(cpuUtilization.podUtilization);
        for(let i=0;i<cpuUtilization.numPods;i++){
            console.log(cpuUtilization.podUtilization[i]);
            if((cpuUtilization.podUtilization[i]/300)*100>targetUtilization){
                flag++;
                break;
            }
            else if((cpuUtilization.podUtilization[i]/300)*100<minUtilization){
                min_flag++;
                break;
            }
        }
        if(min_flag==0&&flag!=0){
            drop_state = 1;
            console.log("Creating a container",numPods+1);
            await resMap.deployNewDeployment();
            if(120000/Math.sqrt(params.interval)>60000){
                params.interval++;
            }
        }
        else if(min_flag>flag){
            if(numPods>1){
                console.log("Deleting a container",numPods-1);
                await resMap.removeDeployment();
            }
            params.interval = 1;
            drop_state = 0;
        }
        else{
            if(params.interval>1){
                params.interval = 1;
                drop_state = 0;
            }
        }
    }
    
}

module.exports = {
    main
}