import { useState } from "react"
import { TrendingUp, Play, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"

export default function StockSpan() {
  const [isCalculating, setIsCalculating] = useState(false)

  const spanData = [
    { day: 1, price: 100, span: 1 },
    { day: 2, price: 80, span: 1 },
    { day: 3, price: 60, span: 1 },
    { day: 4, price: 70, span: 2 },
    { day: 5, price: 60, span: 1 },
    { day: 6, price: 75, span: 4 },
    { day: 7, price: 85, span: 6 },
  ]

  const chartData = spanData.map(item => ({
    name: `Day ${item.day}`,
    price: item.price,
    span: item.span
  }))

  const handleCalculate = () => {
    setIsCalculating(true)
    // Simulate C program execution
    setTimeout(() => {
      setIsCalculating(false)
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
          Demo mode: Showing simulated results of Monotonic Stack algorithm for Stock Span calculation.
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
                value="Current uploaded data" 
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

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Explanation</CardTitle>
          <CardDescription>
            Understanding the Stock Span Problem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="text-muted-foreground">
              The stock span problem finds the number of consecutive days before each day where the price was less than or equal to the current day's price. 
              Using a monotonic stack, we can solve this efficiently in O(n) time.
            </p>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Stock Span Results"
        description="Calculated span values for each trading day"
        headers={["Day", "Price ($)", "Span (Days)"]}
        data={spanData}
      />
    </div>
  )
}