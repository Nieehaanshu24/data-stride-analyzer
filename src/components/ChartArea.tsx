import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ChartAreaProps {
  title: string
  description: string
  data?: any[]
  children?: React.ReactNode
  chartType?: 'line' | 'bar' | 'dual'
  dataKeys?: { primary?: string; secondary?: string }
}

export function ChartArea({ title, description, data, children, chartType = 'line', dataKeys = {} }: ChartAreaProps) {
  const defaultData = [
    { name: 'Day 1', value: 100 },
    { name: 'Day 2', value: 105 },
    { name: 'Day 3', value: 98 },
    { name: 'Day 4', value: 110 },
    { name: 'Day 5', value: 115 },
    { name: 'Day 6', value: 108 },
    { name: 'Day 7', value: 120 },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children || (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={data || defaultData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar 
                    dataKey={dataKeys.primary || "value"} 
                    fill="hsl(var(--primary))" 
                  />
                </BarChart>
              ) : chartType === 'dual' ? (
                <LineChart data={data || defaultData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey={dataKeys.primary || "price"} 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={dataKeys.secondary || "span"} 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              ) : (
                <LineChart data={data || defaultData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey={dataKeys.primary || "value"} 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}