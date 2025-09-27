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

      <Card>
        <CardHeader>
          <CardTitle>About This Demo</CardTitle>
          <CardDescription>Technical implementation details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="text-muted-foreground">
              This demo showcases three fundamental algorithms for stock data analysis:
            </p>
            <ul className="text-muted-foreground mt-2 space-y-1">
              <li><strong>Stock Span Problem:</strong> Uses a monotonic stack to find the span of stock prices efficiently</li>
              <li><strong>Range Queries:</strong> Implements segment trees for fast range minimum/maximum/sum queries</li>
              <li><strong>Sliding Window:</strong> Employs double-ended queues for optimal sliding window maximum/minimum</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              All algorithms run in optimal time complexity and are demonstrated with interactive visualizations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}