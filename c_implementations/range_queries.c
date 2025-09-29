#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    double *tree;
    int size;
} SegmentTree;

SegmentTree* createSegmentTree(double arr[], int n) {
    SegmentTree* st = (SegmentTree*)malloc(sizeof(SegmentTree));
    st->size = 4 * n;  // Safe size for segment tree
    st->tree = (double*)malloc(st->size * sizeof(double));
    
    buildTree(st, arr, 0, 0, n - 1);
    return st;
}

void buildTree(SegmentTree* st, double arr[], int node, int start, int end) {
    if (start == end) {
        st->tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        buildTree(st, arr, 2 * node + 1, start, mid);
        buildTree(st, arr, 2 * node + 2, mid + 1, end);
        
        // For maximum query (change operation as needed)
        st->tree[node] = (st->tree[2 * node + 1] > st->tree[2 * node + 2]) 
                        ? st->tree[2 * node + 1] : st->tree[2 * node + 2];
    }
}

double rangeMaxQuery(SegmentTree* st, int node, int start, int end, int l, int r) {
    if (r < start || end < l) {
        return -DBL_MAX;  // Out of range
    }
    if (l <= start && end <= r) {
        return st->tree[node];  // Total overlap
    }
    
    // Partial overlap
    int mid = (start + end) / 2;
    double leftMax = rangeMaxQuery(st, 2 * node + 1, start, mid, l, r);
    double rightMax = rangeMaxQuery(st, 2 * node + 2, mid + 1, end, l, r);
    
    return (leftMax > rightMax) ? leftMax : rightMax;
}

double rangeMinQuery(SegmentTree* st, int node, int start, int end, int l, int r) {
    if (r < start || end < l) {
        return DBL_MAX;  // Out of range
    }
    if (l <= start && end <= r) {
        return st->tree[node];  // Total overlap
    }
    
    // Partial overlap
    int mid = (start + end) / 2;
    double leftMin = rangeMinQuery(st, 2 * node + 1, start, mid, l, r);
    double rightMin = rangeMinQuery(st, 2 * node + 2, mid + 1, end, l, r);
    
    return (leftMin < rightMin) ? leftMin : rightMin;
}

int main() {
    double prices[] = {150.25, 152.30, 148.90, 155.75, 157.20};
    int n = sizeof(prices) / sizeof(prices[0]);
    
    SegmentTree* st = createSegmentTree(prices, n);
    
    printf("Range Maximum Query (0-3): %.2f\n", 
           rangeMaxQuery(st, 0, 0, n-1, 0, 3));
    printf("Range Minimum Query (1-4): %.2f\n", 
           rangeMinQuery(st, 0, 0, n-1, 1, 4));
    
    free(st->tree);
    free(st);
    return 0;
}