import { Link } from "react-router-dom"
import { TrendingUp, Upload as UploadIcon, AreaChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartArea } from "@/components/ChartArea"

export default function Index() {
  const features = [
    {
      icon: UploadIcon,
      title: "Data Upload",
      description: "Upload CSV files or enter stock data manually",
      link: "/upload",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Stock Span Analysis",
      description: "Calculate stock span using Monotonic Stack algorithm",
      link: "/stock-span",
      color: "text-chart-2"
    },
    {
      icon: AreaChart,
      title: "Range Queries",
      description: "Efficient range queries with Segment Tree",
      link: "/range-queries",
      color: "text-chart-3"
    },
    {
      icon: Activity,
      title: "Sliding Window",
      description: "Max/Min analysis using Deque-based algorithm",
      link: "/sliding-window",
      color: "text-chart-4"
    }
  ]

  const sampleData = [
    { name: 'Jan', value: 150 },
    { name: 'Feb', value: 165 },
    { name: 'Mar', value: 142 },
    { name: 'Apr', value: 178 },
    { name: 'May', value: 155 },
    { name: 'Jun', value: 188 },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Dynamic Stock Analyzer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analyze stock data efficiently using advanced algorithms. Demo featuring 
          Monotonic Stack, Segment Trees, and Sliding Window techniques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <feature.icon className={`h-8 w-8 mx-auto mb-2 ${feature.color}`} />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to={feature.link}>
                  Explore
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartArea 
          title="Sample Stock Performance"
          description="Example data visualization capabilities"
          data={sampleData}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Complexities</CardTitle>
            <CardDescription>Performance characteristics of implemented algorithms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
              <span className="font-medium">Stock Span (Monotonic Stack)</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">O(n)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
              <span className="font-medium">Range Queries (Segment Tree)</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">O(log n)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
              <span className="font-medium">Sliding Window (Deque)</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">O(n)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Structures Used</CardTitle>
            <CardDescription>Core data structures powering the algorithms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Monotonic Stack</h4>
              <p className="text-sm text-muted-foreground">
                A stack that maintains elements in either increasing or decreasing order. 
                Used in Stock Span to efficiently track previous higher prices.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Segment Tree</h4>
              <p className="text-sm text-muted-foreground">
                A binary tree that stores information about array segments. 
                Enables fast range queries (min, max, sum) in O(log n) time.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Deque (Double-ended Queue)</h4>
              <p className="text-sm text-muted-foreground">
                Allows insertion/deletion at both ends in O(1) time. 
                Perfect for sliding window maximum/minimum problems.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Tools Explained</CardTitle>
            <CardDescription>What each tool does for stock analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-chart-2 mb-2">Stock Span</h4>
              <p className="text-sm text-muted-foreground">
                Calculates how many consecutive days before each day the stock price was 
                less than or equal to current day's price. Useful for trend analysis.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-chart-3 mb-2">Range Queries</h4>
              <p className="text-sm text-muted-foreground">
                Quickly finds minimum, maximum, or sum of stock prices within any date range. 
                Essential for period-wise analysis and risk assessment.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold text-chart-4 mb-2">Sliding Window</h4>
              <p className="text-sm text-muted-foreground">
                Finds maximum or minimum price within a moving window of specified size. 
                Helps identify short-term trends and volatility patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>C Language Implementation</CardTitle>
          <CardDescription>All algorithms are implemented in C for optimal performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="text-muted-foreground">
              This demonstration uses C language implementations for all data structure operations:
            </p>
            <ul className="text-muted-foreground mt-2 space-y-1">
              <li><strong>Memory Efficiency:</strong> Direct memory management with malloc/free</li>
              <li><strong>Performance:</strong> Compiled C code runs faster than interpreted languages</li>
              <li><strong>Low-level Control:</strong> Precise control over data structure implementation</li>
              <li><strong>Industry Standard:</strong> C is widely used in high-frequency trading systems</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Upload your CSV data to see these algorithms process real stock information with C-level efficiency.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}