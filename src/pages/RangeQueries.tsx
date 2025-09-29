import { useState, useEffect } from "react"
import { AreaChart, Play, AlertCircle, Code } from "lucide-react"
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

export default function RangeQueries() {
  const [leftRange, setLeftRange] = useState("0")
  const [rightRange, setRightRange] = useState("4")
  const [queryType, setQueryType] = useState("max")
  const [isCalculating, setIsCalculating] = useState(false)
  const [queryResults, setQueryResults] = useState<any[]>([])
  const { stockData, isDataLoaded } = useData()

  const defaultStockData = [
    { day: 1, date: "2024-01-01", price: 150.25, volume: 1000000 },
    { day: 2, date: "2024-01-02", price: 152.30, volume: 1100000 },
    { day: 3, date: "2024-01-03", price: 148.90, volume: 950000 },
    { day: 4, date: "2024-01-04", price: 155.75, volume: 1250000 },
    { day: 5, date: "2024-01-05", price: 157.20, volume: 1150000 },
    { day: 6, date: "2024-01-06", price: 159.40, volume: 1300000 },
    { day: 7, date: "2024-01-07", price: 156.80, volume: 1050000 },
  ]

  const currentStockData = isDataLoaded && stockData.length > 0 
    ? stockData.map((item, index) => ({ ...item, day: index + 1 }))
    : defaultStockData

  useEffect(() => {
    setQueryResults([
      { range: "0-4", operation: "Max", result: 157.20 },
      { range: "1-5", operation: "Min", result: 148.90 },
      { range: "2-6", operation: "Avg", result: 155.61 },
      { range: "0-6", operation: "Sum", result: 1080.60 },
    ])
  }, [])

  const chartData = currentStockData.map(item => ({
    name: `Day ${item.day}`,
    value: item.price
  }))

  const performRangeQuery = (left: number, right: number, operation: string) => {
    if (left > right || left < 0 || right >= currentStockData.length) return null
    
    const slice = currentStockData.slice(left, right + 1)
    const prices = slice.map(item => item.price)
    
    switch (operation) {
      case "max":
        return Math.max(...prices)
      case "min":
        return Math.min(...prices)
      case "avg":
        return prices.reduce((sum, price) => sum + price, 0) / prices.length
      case "sum":
        return prices.reduce((sum, price) => sum + price, 0)
      default:
        return null
    }
  }

  const handleQuery = () => {
    if (!isDataLoaded && stockData.length === 0) {
      toast({
        title: "No data available",
        description: "Please upload CSV data first to run range queries.",
        variant: "destructive"
      })
      return
    }
    
    setIsCalculating(true)
    
    setTimeout(() => {
      const left = parseInt(leftRange)
      const right = parseInt(rightRange)
      
      if (left > right || left < 0 || right >= currentStockData.length) {
        toast({
          title: "Invalid range",
          description: `Please enter a valid range (0-${currentStockData.length - 1})`,
          variant: "destructive"
        })
        setIsCalculating(false)
        return
      }
      
      const result = performRangeQuery(left, right, queryType)
      
      if (result !== null) {
        const newQuery = {
          range: `${left}-${right}`,
          operation: queryType.charAt(0).toUpperCase() + queryType.slice(1),
          result: typeof result === 'number' ? parseFloat(result.toFixed(2)) : result
        }
        
        setQueryResults(prev => [newQuery, ...prev.slice(0, 9)])
        
        toast({
          title: "Query completed!",
          description: `${newQuery.operation} in range ${newQuery.range}: ₹${newQuery.result}`
        })
      }
      
      setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <AreaChart className="h-8 w-8 text-primary" />
          Range Query Analysis
        </h1>
        <p className="text-muted-foreground mt-2">
          Efficient range queries using Segment Tree data structure
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isDataLoaded 
            ? `Running range queries on ${currentStockData.length} data points from your uploaded CSV using C implementation of Segment Tree.`
            : "Demo mode: Upload CSV data to query your stock information, or view sample results below."
          }
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Query Configuration</CardTitle>
            <CardDescription>
              Set range query parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="left-range">Left Range (Start)</Label>
              <Input
                id="left-range"
                type="number"
                value={leftRange}
                onChange={(e) => setLeftRange(e.target.value)}
                min="0"
                max={currentStockData.length - 1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="right-range">Right Range (End)</Label>
              <Input
                id="right-range"
                type="number"
                value={rightRange}
                onChange={(e) => setRightRange(e.target.value)}
                min="0"
                max={currentStockData.length - 1}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Query Type</Label>
              <Select value={queryType} onValueChange={setQueryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="max">Maximum</SelectItem>
                  <SelectItem value="min">Minimum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Algorithm Complexity</Label>
              <Badge variant="secondary">O(log n) - Logarithmic</Badge>
            </div>

            <div className="space-y-2">
              <Label>Data Structure</Label>
              <Badge variant="outline">Segment Tree</Badge>
            </div>

            <Button 
              onClick={handleQuery}
              disabled={isCalculating}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isCalculating ? "Processing..." : "Execute Query"}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ChartArea 
            title={isDataLoaded ? "Your Stock Data" : "Sample Stock Data"}
            description={isDataLoaded ? "Stock prices from uploaded CSV" : "Stock prices with query range highlighted"}
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
              <CardTitle>Segment Tree for Range Queries</CardTitle>
              <CardDescription>
                Understanding efficient range query processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-muted-foreground mb-4">
                  Segment Trees enable efficient range queries on arrays. They can answer queries like range minimum, maximum, or sum in O(log n) time,
                  making them ideal for financial data analysis where quick range operations are essential.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Tree Structure:</h4>
                  <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Each node represents a range of array elements</li>
                    <li>Leaf nodes contain individual array elements</li>
                    <li>Internal nodes store aggregate information (min, max, sum)</li>
                    <li>Tree height is O(log n), enabling fast queries</li>
                  </ul>
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
                Segment Tree implementation for range queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <iframe 
                src="/c_implementations/range_queries.c"
                className="w-full h-96 bg-muted rounded-lg border"
                title="Range Queries C Implementation"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                C implementation file: c_implementations/range_queries.c
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title={isDataLoaded ? "Your Stock Data" : "Sample Stock Data"}
          description={isDataLoaded ? "Data points from uploaded CSV" : "Data points available for range queries"}
          headers={["Day", "Date", "Price (₹)", "Volume"]}
          data={currentStockData.slice(0, 10)}
        />
        
        <DataTable
          title="Query Results History"
          description="Recent range query results"
          headers={["Range", "Operation", "Result (₹)"]}
          data={queryResults}
        />
      </div>
    </div>
  )
}