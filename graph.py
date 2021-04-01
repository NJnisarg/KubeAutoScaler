import matplotlib.pyplot as plt
import math

def plot():
    arr = [0]
    with open('rps_resp.txt') as f:
        for line in f:
            l = len(arr)
            arr.append(math.floor(float(line.split(',')[1].split("\n")[0])/100))
        
        newArr = []
        cSum = 0
        for i in range(0, len(arr)):
            if(i%4==0):
                newArr.append(cSum/4)
                cSum = 0
            else:
                cSum += 4*arr[i]
            

        x = [i for i in range(0, len(newArr))]
        print(x, newArr)
        plt.plot(x, newArr)
        plt.savefig('res_PID.png');

plot()