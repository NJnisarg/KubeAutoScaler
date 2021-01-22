const axios = require('axios');

const loadTest = () => {
    for(let i=0;i<20000;i+=1)
    {
        setTimeout(() => {
            axios.post('http://192.168.39.147:30001/imageResize', {
                imgUrl: 'https://i.pinimg.com/564x/7f/03/ed/7f03ede8a2b6341ccc42f205c36479b7.jpg',
              })
        }, 20*i);
    }
}

loadTest();
