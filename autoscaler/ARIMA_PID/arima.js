const ARIMA = require('arima')

class ARIMAScaler {

    data
    arimaModel

    constructor(data) {
        this.data = data;
        this.arimaModel = new ARIMA({auto:true}).fit(data.slice(0,20));
    }

    arimaUpdate(val) {
        this.data.push(val);
        this.arimaModel.fit(this.data.slice(-10));
    }

    arimaCPUChecker = () => {
        const [pred, errors] = this.arimaModel.predict(1);
        return [pred, errors];
    }
}


module.exports = {
    ARIMAScaler
}
