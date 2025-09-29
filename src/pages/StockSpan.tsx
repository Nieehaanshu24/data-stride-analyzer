import { useState, useEffect } from "react"
import { TrendingUp, Play, AlertCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StockSpan() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [spanData, setSpanData] = useState<any[]>([])
  const { stockData, isDataLoaded } = useData()

  // Calculate stock span using uploaded data
  const calculateStockSpan = (prices: number[]) => {
    const spans: number[] = []
    const stack: number[] = []

    for (let i = 0; i < prices.length; i++) {
      while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
        stack.pop()
      }
      spans[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1]
      stack.push(i)
    }
    return spans
  }

  useEffect(() => {
    if (isDataLoaded && stockData.length > 0) {
      const prices = stockData.map(item => item.price)
      const spans = calculateStockSpan(prices)
      const newSpanData = stockData.map((item, index) => ({
        day: index + 1,
        date: item.date,
        price: item.price,
        span: spans[index]
      }))
      setSpanData(newSpanData)
    } else {
      // Default demo data
      setSpanData([
        { day: 1, date: "2024-01-01", price: 100, span: 1 },
        { day: 2, date: "2024-01-02", price: 80, span: 1 },
        { day: 3, date: "2024-01-03", price: 60, span: 1 },
        { day: 4, date: "2024-01-04", price: 70, span: 2 },
        { day: 5, date: "2024-01-05", price: 60, span: 1 },
        { day: 6, date: "2024-01-06", price: 75, span: 4 },
        { day: 7, date: "2024-01-07", price: 85, span: 6 },
      ])
    }
  }, [stockData, isDataLoaded])

  const chartData = spanData.map(item => ({
    name: `Day ${item.day}`,
    price: item.price,
    span: item.span
  }))

  const handleCalculate = () => {
    if (!isDataLoaded || stockData.length === 0) {
      toast({
        title: "No data available",
        description: "Please upload CSV data first to run the analysis.",
        variant: "destructive"
      })
      return
    }
    
    setIsCalculating(true)
    // Simulate C program execution
    setTimeout(() => {
      setIsCalculating(false)
      toast({
        title: "Stock Span Calculated!",
        description: `Analysis completed for ${stockData.length} data points using Monotonic Stack algorithm.`
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Stock Span Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Calculate the span of stock prices using Monotonic Stack algorithm
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isDataLoaded 
            ? `Analyzing ${stockData.length} data points from your uploaded CSV using C implementation of Monotonic Stack algorithm.`
            : "Demo mode: Upload CSV data to analyze your stock information, or view sample results below."
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Configuration</CardTitle>
            <CardDescription>
              Set parameters for the Monotonic Stack algorithm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataset">Dataset</Label>
              <Input 
                id="dataset" 
                value={isDataLoaded ? `${stockData.length} rows from CSV` : "No data uploaded"} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Algorithm Complexity</Label>
              <Badge variant="secondary">O(n) - Linear Time</Badge>
            </div>

            <div className="space-y-2">
              <Label>Data Structure</Label>
              <Badge variant="outline">Monotonic Stack</Badge>
            </div>

            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isCalculating ? "Calculating..." : "Calculate Stock Span"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ChartArea 
            title="Stock Span Visualization"
            description="Stock prices and their corresponding span values"
            data={chartData}
            chartType="dual"
            dataKeys={{ primary: "price", secondary: "span" }}
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
              <CardTitle>Stock Span Problem</CardTitle>
              <CardDescription>
                Understanding the Monotonic Stack algorithm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-muted-foreground mb-4">
                  The stock span problem finds the number of consecutive days before each day where the price was less than or equal to the current day's price. 
                  Using a monotonic stack, we can solve this efficiently in O(n) time.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Algorithm Steps:</h4>
                  <ol className="text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Initialize an empty stack to store indices</li>
                    <li>For each day, pop elements from stack while their prices ≤ current price</li>
                    <li>Span = current index - index of element at stack top (or current index + 1 if stack empty)</li>
                    <li>Push current index to stack</li>
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
                Complete C code for Stock Span calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <iframe 
                src="/c_implementations/stock_span.c"
                className="w-full h-96 bg-muted rounded-lg border"
                title="Stock Span C Implementation"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                C implementation file: c_implementations/stock_span.c
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DataTable
        title="Stock Span Results"
        description={isDataLoaded ? "Calculated span values from your uploaded data" : "Sample span calculation results"}
        headers={["Day", "Date", "Price (₹)", "Span (Days)"]}
        data={spanData}
      />
    </div>
  )
}