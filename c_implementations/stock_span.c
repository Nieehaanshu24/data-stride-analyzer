#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int top;
    int capacity;
} Stack;

Stack* createStack(int capacity) {
    Stack* stack = (Stack*)malloc(sizeof(Stack));
    stack->data = (int*)malloc(capacity * sizeof(int));
    stack->top = -1;
    stack->capacity = capacity;
    return stack;
}

void push(Stack* stack, int item) {
    stack->data[++stack->top] = item;
}

int pop(Stack* stack) {
    return stack->data[stack->top--];
}

int isEmpty(Stack* stack) {
    return stack->top == -1;
}

int peek(Stack* stack) {
    return stack->data[stack->top];
}

void calculateStockSpan(double prices[], int spans[], int n) {
    Stack* stack = createStack(n);
    
    for (int i = 0; i < n; i++) {
        // Pop elements while stack is not empty and 
        // top element's price is <= current price
        while (!isEmpty(stack) && prices[peek(stack)] <= prices[i]) {
            pop(stack);
        }
        
        // Calculate span
        spans[i] = isEmpty(stack) ? (i + 1) : (i - peek(stack));
        
        // Push current element index
        push(stack, i);
    }
    
    free(stack->data);
    free(stack);
}

int main() {
    double prices[] = {100, 80, 60, 70, 60, 75, 85};
    int n = sizeof(prices) / sizeof(prices[0]);
    int spans[n];
    
    calculateStockSpan(prices, spans, n);
    
    printf("Day\tPrice\tSpan\n");
    for (int i = 0; i < n; i++) {
        printf("%d\t%.2f\t%d\n", i+1, prices[i], spans[i]);
    }
    
    return 0;
}