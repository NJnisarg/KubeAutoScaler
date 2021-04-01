import matplotlib.pyplot as plt
import math

def plot():
    arr = [0]
    with open('rps_resp.txt') as f:
        for line in f:
            l = len(arr)
            arr.append(math.floor(2.5*float(line.split(',')[0])))

        x = [i for i in range(0, len(arr))]
        print(x, arr)
        plt.plot(x, arr)
        plt.savefig('rps_ARIMA_PID.png');

plot()