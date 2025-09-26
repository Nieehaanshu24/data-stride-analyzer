import { useState } from "react"
import { AreaChart, Play, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RangeQueries() {
  const [leftRange, setLeftRange] = useState("1")
  const [rightRange, setRightRange] = useState("7")
  const [queryType, setQueryType] = useState("max")
  const [isCalculating, setIsCalculating] = useState(false)

  const stockData = [
    { day: 1, price: 100 },
    { day: 2, price: 80 },
    { day: 3, price: 60 },
    { day: 4, price: 70 },
    { day: 5, price: 60 },
    { day: 6, price: 75 },
    { day: 7, price: 85 },
  ]

  const queryResults = [
    { range: "[1, 7]", operation: "Max", result: 100 },
    { range: "[1, 7]", operation: "Min", result: 60 },
    { range: "[1, 7]", operation: "Avg", result: 75.71 },
    { range: "[3, 6]", operation: "Max", result: 75 },
    { range: "[3, 6]", operation: "Min", result: 60 },
  ]

  const handleQuery = () => {
    setIsCalculating(true)
    // Simulate C program execution
    setTimeout(() => {
      setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <AreaChart className="h-8 w-8 text-primary" />
          Range Queries
        </h1>
        <p className="text-muted-foreground mt-2">
          Perform efficient range queries using Segment Tree or Fenwick Tree
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The C algorithm (range_queries.c) will be executed when Supabase backend is connected.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Query Configuration</CardTitle>
            <CardDescription>
              Set range and operation for the query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="left-range">Left (L)</Label>
                <Input 
                  id="left-range" 
                  type="number"
                  value={leftRange}
                  onChange={(e) => setLeftRange(e.target.value)}
                  min="1"
                  max="7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="right-range">Right (R)</Label>
                <Input 
                  id="right-range" 
                  type="number"
                  value={rightRange}
                  onChange={(e) => setRightRange(e.target.value)}
                  min="1"
                  max="7"
                />
              </div>
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
              <Badge variant="secondary">O(log n) - Query</Badge>
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

            {!isCalculating && (
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium">Current Query:</p>
                <p className="text-sm text-muted-foreground">
                  {queryType.toUpperCase()}([{leftRange}, {rightRange}])
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <ChartArea 
            title="Range Query Visualization"
            description={`Highlighting range [${leftRange}, ${rightRange}] for ${queryType} operation`}
          >
            <div className="text-center py-12 text-muted-foreground">
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Range visualization will appear here</p>
            </div>
          </ChartArea>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Explanation</CardTitle>
            <CardDescription>
              Understanding Segment Trees and Range Queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="text-muted-foreground">
                Segment Trees enable efficient range queries in O(log n) time. They preprocess data to answer 
                range minimum, maximum, sum, or average queries quickly, making them ideal for stock analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        <DataTable
          title="Sample Stock Data"
          description="Current dataset for range queries"
          headers={["Day", "Price ($)"]}
          data={stockData}
        />
      </div>

      <DataTable
        title="Query Results History"
        description="Previous range query results"
        headers={["Range", "Operation", "Result"]}
        data={queryResults}
      />
    </div>
  )
}