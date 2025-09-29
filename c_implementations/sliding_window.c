#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int front, rear, size, capacity;
} Deque;

Deque* createDeque(int capacity) {
    Deque* dq = (Deque*)malloc(sizeof(Deque));
    dq->data = (int*)malloc(capacity * sizeof(int));
    dq->front = -1;
    dq->rear = -1;
    dq->size = 0;
    dq->capacity = capacity;
    return dq;
}

int isEmpty(Deque* dq) {
    return dq->size == 0;
}

void pushBack(Deque* dq, int item) {
    if (dq->size == 0) {
        dq->front = dq->rear = 0;
    } else {
        dq->rear = (dq->rear + 1) % dq->capacity;
    }
    dq->data[dq->rear] = item;
    dq->size++;
}

void popFront(Deque* dq) {
    if (dq->size == 1) {
        dq->front = dq->rear = -1;
    } else {
        dq->front = (dq->front + 1) % dq->capacity;
    }
    dq->size--;
}

void popBack(Deque* dq) {
    if (dq->size == 1) {
        dq->front = dq->rear = -1;
    } else {
        dq->rear = (dq->rear - 1 + dq->capacity) % dq->capacity;
    }
    dq->size--;
}

int front(Deque* dq) {
    return dq->data[dq->front];
}

int back(Deque* dq) {
    return dq->data[dq->rear];
}

void slidingWindowMaximum(double arr[], int n, int k, double result[]) {
    Deque* dq = createDeque(n);
    
    // Process first window
    for (int i = 0; i < k; i++) {
        // Remove indices of smaller elements
        while (!isEmpty(dq) && arr[i] >= arr[back(dq)]) {
            popBack(dq);
        }
        pushBack(dq, i);
    }
    
    // The front of deque contains the largest element of first window
    result[0] = arr[front(dq)];
    
    // Process remaining elements
    for (int i = k; i < n; i++) {
        // Remove indices that are out of current window
        while (!isEmpty(dq) && front(dq) <= i - k) {
            popFront(dq);
        }
        
        // Remove indices of smaller elements
        while (!isEmpty(dq) && arr[i] >= arr[back(dq)]) {
            popBack(dq);
        }
        
        pushBack(dq, i);
        result[i - k + 1] = arr[front(dq)];
    }
    
    free(dq->data);
    free(dq);
}

int main() {
    double prices[] = {150.25, 152.30, 148.90, 155.75, 157.20, 159.40};
    int n = sizeof(prices) / sizeof(prices[0]);
    int k = 3;  // Window size
    double result[n - k + 1];
    
    slidingWindowMaximum(prices, n, k, result);
    
    printf("Sliding Window Maximum (k=%d):\n", k);
    for (int i = 0; i < n - k + 1; i++) {
        printf("Window %d-%d: %.2f\n", i+1, i+k, result[i]);
    }
    
    return 0;
}