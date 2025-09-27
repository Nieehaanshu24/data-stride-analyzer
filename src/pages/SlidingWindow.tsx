import { useState } from "react"
import { Activity, Play, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SlidingWindow() {
  const [windowSize, setWindowSize] = useState("3")
  const [operation, setOperation] = useState("max")
  const [isCalculating, setIsCalculating] = useState(false)

  const stockData = [
    { day: 1, price: 100 },
    { day: 2, price: 80 },
    { day: 3, price: 60 },
    { day: 4, price: 70 },
    { day: 5, price: 60 },
    { day: 6, price: 75 },
    { day: 7, price: 85 },
    { day: 8, price: 90 },
  ]

  const slidingResults = [
    { window: "[1-3]", prices: "100, 80, 60", max: 100, min: 60 },
    { window: "[2-4]", prices: "80, 60, 70", max: 80, min: 60 },
    { window: "[3-5]", prices: "60, 70, 60", max: 70, min: 60 },
    { window: "[4-6]", prices: "70, 60, 75", max: 75, min: 60 },
    { window: "[5-7]", prices: "60, 75, 85", max: 85, min: 60 },
    { window: "[6-8]", prices: "75, 85, 90", max: 90, min: 75 },
  ]

  const handleCalculate = () => {
    setIsCalculating(true)
    // Simulate C program execution
    setTimeout(() => {
      setIsCalculating(false)
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
          Demo mode: Showing simulated results of Deque-based algorithm for sliding window max/min.
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
                min="2"
                max="7"
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

            {!isCalculating && (
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium">Current Configuration:</p>
                <p className="text-sm text-muted-foreground">
                  Window size: {windowSize} days
                </p>
                <p className="text-sm text-muted-foreground">
                  Operation: {operation.toUpperCase()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ChartArea 
            title="Sliding Window Visualization"
            description={`${windowSize}-day sliding window ${operation} analysis`}
            data={stockData.map(item => ({ name: `Day ${item.day}`, value: item.price }))}
            chartType="line"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Explanation</CardTitle>
            <CardDescription>
              Understanding Sliding Window with Deque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="text-muted-foreground">
                The sliding window maximum/minimum problem uses a deque to maintain potential candidates 
                for the maximum/minimum in the current window. This approach achieves O(n) amortized time complexity.
              </p>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Current Stock Data"
          description="Dataset for sliding window analysis"
          headers={["Day", "Price ($)"]}
          data={stockData}
        />
      </div>

      <DataTable
        title="Sliding Window Results"
        description="Maximum and minimum values for each window position"
        headers={["Window", "Prices", "Max", "Min"]}
        data={slidingResults}
      />
    </div>
  )
}