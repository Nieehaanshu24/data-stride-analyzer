import { useState } from "react"
import { Upload as UploadIcon, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"

export default function Upload() {
  const [csvData, setCsvData] = useState("")
  const [fileName, setFileName] = useState("")

  const sampleData = [
    { date: "2024-01-01", price: 150.25, volume: 1000000 },
    { date: "2024-01-02", price: 152.30, volume: 1100000 },
    { date: "2024-01-03", price: 148.90, volume: 950000 },
    { date: "2024-01-04", price: 155.75, volume: 1250000 },
    { date: "2024-01-05", price: 157.20, volume: 1150000 },
  ]

  const chartData = sampleData.map((item, index) => ({
    name: `Day ${index + 1}`,
    value: item.price
  }))

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // In real implementation, would parse CSV here
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload your stock data to begin analysis
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Demo mode: Using sample data for algorithm demonstrations. Real file processing would require backend integration.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadIcon className="h-5 w-5" />
                Upload Stock Data
              </CardTitle>
              <CardDescription>
                Upload a CSV file with columns: Date, Price, Volume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input 
                  id="csv-file" 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                {fileName && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {fileName}
                  </p>
                )}
              </div>
              <Button className="w-full max-w-sm">
                Process Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Entry</CardTitle>
              <CardDescription>
                Enter stock data manually in CSV format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csv-data">CSV Data</Label>
                <Textarea
                  id="csv-data"
                  placeholder="Date,Price,Volume&#10;2024-01-01,150.25,1000000&#10;2024-01-02,152.30,1100000"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={8}
                />
              </div>
              <Button>
                Process Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartArea 
          title="Sample Stock Data"
          description="Preview of uploaded stock prices"
          data={chartData}
        />
        
        <DataTable
          title="Data Summary"
          description="First 5 rows of sample data"
          headers={["Date", "Price ($)", "Volume"]}
          data={sampleData}
        />
      </div>
    </div>
  )
}