const axios = require('axios');
const fs = require('fs');

let avgRespTime = 0
let numReq = 0
let failure = 0

const instance = axios.create()

instance.interceptors.request.use((config) => {
    config.headers['request-startTime'] = process.hrtime()
    return config
})

instance.interceptors.response.use((response) => {
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
    response.headers['request-duration'] = milliseconds
    return response
});

const loadTest = () => {
    // for(let i=0;i<20000;i+=1)
    // {
    //     setTimeout(async () => {
    //         instance.post('http://192.168.39.144:30001/imageBlur', {
    //             imgUrl: 'https://i.pinimg.com/564x/7f/03/ed/7f03ede8a2b6341ccc42f205c36479b7.jpg',
    //         }).then((response) => {
    //             avgRespTime = avgRespTime*numReq + response.headers['request-duration'];
    //             numReq+=1
    //             avgRespTime /= numReq;

    //             console.log(numReq, avgRespTime);
	//         }).catch((err) => {
    //             console.log(err);
    //         })
    //     }, 500*i);
    // }

    interval = 20000
    prevTs = 0
    for(let i=0; i<1000;i+=1)
    {
        for(let j=0;j<i%15;j++)
        {
            gap = Math.round(interval/(4 * (i%15)))
            setTimeout(async () => {
                instance.post('http://192.168.39.144:30001/imageBlur', {
                    imgUrl: 'https://i.pinimg.com/564x/7f/03/ed/7f03ede8a2b6341ccc42f205c36479b7.jpg',
                }).then((response) => {
                    avgRespTime = avgRespTime*numReq + response.headers['request-duration'];
                    numReq+=1
                    avgRespTime /= numReq;
    
                    console.log(numReq, avgRespTime);
                }).catch((err) => {
                    console.log("Failure", failure+1);
                    failure+=1
                })
            }, prevTs);  
            prevTs+=gap 
        }
        setTimeout(() => {
            fs.appendFileSync("rps_resp.txt", `${(4 * i)%15},${avgRespTime}\n`, {encoding:'utf-8'});
        }, interval*i);
        
        
    }
}

loadTest();