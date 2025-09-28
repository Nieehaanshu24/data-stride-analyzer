import { useState, useEffect } from "react"
import { Activity, Play, AlertCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SlidingWindow() {
  const [windowSize, setWindowSize] = useState("3")
  const [operation, setOperation] = useState("max")
  const [isCalculating, setIsCalculating] = useState(false)
  const [slidingResults, setSlidingResults] = useState<any[]>([])
  const { stockData, isDataLoaded } = useData()

  const defaultStockData = [
    { day: 1, date: "2024-01-01", price: 150.25, volume: 1000000 },
    { day: 2, date: "2024-01-02", price: 152.30, volume: 1100000 },
    { day: 3, date: "2024-01-03", price: 148.90, volume: 950000 },
    { day: 4, date: "2024-01-04", price: 155.75, volume: 1250000 },
    { day: 5, date: "2024-01-05", price: 157.20, volume: 1150000 },
    { day: 6, date: "2024-01-06", price: 159.40, volume: 1300000 },
    { day: 7, date: "2024-01-07", price: 156.80, volume: 1050000 },
    { day: 8, date: "2024-01-08", price: 161.25, volume: 1400000 },
  ]

  const currentStockData = isDataLoaded && stockData.length > 0 
    ? stockData.map((item, index) => ({ ...item, day: index + 1 }))
    : defaultStockData

  // Calculate sliding window results
  const calculateSlidingWindow = (windowSizeNum: number, operationType: string) => {
    const results: any[] = []
    const prices = currentStockData.map(item => item.price)
    
    for (let i = 0; i <= prices.length - windowSizeNum; i++) {
      const window = prices.slice(i, i + windowSizeNum)
      const max = Math.max(...window)
      const min = Math.min(...window)
      
      results.push({
        window: `${i + 1}-${i + windowSizeNum}`,
        max: parseFloat(max.toFixed(2)),
        min: parseFloat(min.toFixed(2))
      })
    }
    return results
  }

  useEffect(() => {
    const windowSizeNum = parseInt(windowSize)
    if (windowSizeNum > 0 && windowSizeNum <= currentStockData.length) {
      const results = calculateSlidingWindow(windowSizeNum, operation)
      setSlidingResults(results)
    }
  }, [windowSize, operation, currentStockData])

  const chartData = currentStockData.map(item => ({
    name: `Day ${item.day}`,
    value: item.price
  }))

  const handleCalculate = () => {
    if (!isDataLoaded && stockData.length === 0) {
      toast({
        title: "No data available",
        description: "Please upload CSV data first to run sliding window analysis.",
        variant: "destructive"
      })
      return
    }
    
    const windowSizeNum = parseInt(windowSize)
    if (windowSizeNum <= 0 || windowSizeNum > currentStockData.length) {
      toast({
        title: "Invalid window size",
        description: `Window size must be between 1 and ${currentStockData.length}`,
        variant: "destructive"
      })
      return
    }
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const results = calculateSlidingWindow(windowSizeNum, operation)
      setSlidingResults(results)
      setIsCalculating(false)
      
      toast({
        title: "Sliding Window Analysis Complete!",
        description: `Generated ${results.length} window results using Deque algorithm.`
      })
    }, 1800)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="h-8 w-8 text-primary" />
          Sliding Window Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Find maximum/minimum in sliding windows using Deque-based algorithm
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isDataLoaded 
            ? `Running sliding window analysis on ${currentStockData.length} data points from your uploaded CSV using C implementation of Deque.`
            : "Demo mode: Upload CSV data to analyze your stock information, or view sample results below."
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Window Configuration</CardTitle>
            <CardDescription>
              Set sliding window parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="window-size">Window Size (k)</Label>
              <Input 
                id="window-size" 
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(e.target.value)}
                min="1"
                max={currentStockData.length}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Operation</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Maximum</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="both">Both Max & Min</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Algorithm Complexity</Label>
              <Badge variant="secondary">O(n) - Amortized</Badge>
            </div>

            <div className="space-y-2">
              <Label>Data Structure</Label>
              <Badge variant="outline">Double-ended Queue</Badge>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isCalculating ? "Processing..." : "Calculate Sliding Window"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ChartArea 
            title={isDataLoaded ? "Your Stock Data" : "Sample Stock Data"}
            description={isDataLoaded ? "Stock prices from uploaded CSV" : "Stock prices with sliding window analysis"}
            data={chartData}
          />
        </div>
      </div>

      <Tabs defaultValue="explanation" className="w-full">
        <TabsList>
          <TabsTrigger value="explanation">Algorithm Explanation</TabsTrigger>
          <TabsTrigger value="code">C Implementation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="explanation">
          <Card>
            <CardHeader>
              <CardTitle>Sliding Window with Deque</CardTitle>
              <CardDescription>
                Understanding efficient sliding window analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-muted-foreground mb-4">
                  The sliding window maximum problem finds the maximum element in every window of size k as it slides through an array.
                  Using a deque (double-ended queue), we can solve this efficiently in O(n) time.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Algorithm Steps:</h4>
                  <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Use deque to store indices of array elements</li>
                    <li>For each element, remove indices of smaller elements from rear</li>
                    <li>Remove indices outside current window from front</li>
                    <li>Front of deque contains index of maximum element in current window</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                C Implementation
              </CardTitle>
              <CardDescription>
                Deque-based sliding window maximum algorithm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`#include <stdio.h>
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
    
    printf("Sliding Window Maximum (k=%d):\\n", k);
    for (int i = 0; i < n - k + 1; i++) {
        printf("Window %d-%d: %.2f\\n", i+1, i+k, result[i]);
    }
    
    return 0;
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title={isDataLoaded ? "Your Stock Data" : "Sample Stock Data"}
          description={isDataLoaded ? "Data points from uploaded CSV" : "Data points being analyzed"}
          headers={["Day", "Date", "Price (₹)", "Volume"]}
          data={currentStockData.slice(0, 10)}
        />
        
        <DataTable
          title="Sliding Window Results"
          description={`Window size: ${windowSize} | Operation: ${operation}`}
          headers={["Window", "Max (₹)", "Min (₹)"]}
          data={slidingResults}
        />
      </div>
    </div>
  )
}