const axios = require('axios');

const loadTest = () => {
    for(let i=0;i<12000;i+=1)
    {
        setTimeout(() => {
            axios.get('http://192.168.39.147:30001/')
        }, 100*i);
    }
}

loadTest();
