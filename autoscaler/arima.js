const ARIMA = require('arima');

class ARIMAScaler {

    cpuUsage = []
    isArima = false
    arimaModel = null
    i = 0

    constructor() {
        this.cpuUsage = [];
        this.arimaModel = new ARIMA({auto: true})
    }

    arimaUpdate(val) {
        this.i = this.i+1
        if(val > 0) {
            this.cpuUsage.push(val)
        }
        console.log("--------Length-------", this.cpuUsage.length)
        console.log("i: ", this.i)
        if(this.cpuUsage.length > 10) {
            console.log("******************************************")
            console.log("-------------ARIMA Activated--------------")
            this.cpuUsage.shift()
            this.isArima = true
            this.arimaModel.fit(this.cpuUsage)
        }
    }

    arimaPredict() {
        const [pred, errors] = this.arimaModel.predict(1);
        return pred[0]
    }
}

module.exports = {
    ARIMAScaler
}

/*data = [1, 2, 4, 2, 1, 4, 1, 3, 5, 6]

arimaModel = new ARIMA({auto: true}).fit(data)

let [pred, errs] = arimaModel.predict(1)

console.log("pred: ", pred[0])

console.log("error: ", errs)*/