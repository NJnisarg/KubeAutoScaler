const axios = require('axios');

const loadTest = () => {
    for(let i=0;i<1000;i+=1)
    {
        setTimeout(() => {
            axios.get('http://192.168.39.102:30001/')
        }, 1000*i);
    }
}

loadTest();
