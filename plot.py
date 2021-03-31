import matplotlib.pyplot as plt
import math

def plot():
    arr = [0]
    with open('cpu.txt') as f:
        for line in f:
            l = len(arr)
            arr.append((arr[l-1]*l + math.floor(float(line.split('\n')[0])))/(l+1))
        
        x = [i for i in range(0, len(arr))]
        print(x, arr)
        plt.plot(x, arr)
        plt.savefig('qu.png')

plot()