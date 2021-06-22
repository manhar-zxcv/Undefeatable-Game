from random import randint,choice
from functools import reduce

def player(left,arr):
    x = choice(left)
    y = randint(1,arr[x])
    arr[x] -= y
    if not arr[x]:
        left.remove(x)

def comp(left,arr,arr1):
    xor = reduce(lambda xx,yy:xx^yy,arr)
    for ind in left:
        i = arr[ind]
        xor1 = i^xor
        if xor1 < i:
            arr[ind] = xor1
            if not arr[ind]:
                left.remove(ind)
            return
    print('No value chosen')
    print(*arr1)
    exit()

def main():
    max,min = 16,1
    for _ in range(10000):
        n = randint(5,10)
        while 1:
            arr = [randint(min,max) for _ in range(n-1)]
            xor = reduce(lambda xx,yy:xx^yy,arr)
            if xor != 0:
                arr.append(xor)
                break
        arr1 = arr[:]
        left = list(range(n))
        while arr != [0]*n:
            player(left,arr)
            if arr == [0]*n:
                print('comp lose')
                print(*arr1)
                exit()
            comp(left,arr,arr1)
        print('victory')

main()