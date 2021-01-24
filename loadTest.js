const axios = require('axios');

const loadTest = () => {
    for(let i=0;i<20000;i+=1)
    {
        setTimeout(async (i) => {
            axios.post('http://192.168.39.22:30001/imageBlur', {
                imgUrl: 'https://i.pinimg.com/564x/7f/03/ed/7f03ede8a2b6341ccc42f205c36479b7.jpg',
              }).then((res) => {
	   
	    	console.log(i,res.data);
	     })
        }, 200*i, i);
    }
}

loadTest();
