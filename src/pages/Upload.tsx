import { useState, useEffect } from "react"
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChartArea } from "@/components/ChartArea"
import { DataTable } from "@/components/DataTable"
import { useData } from "@/contexts/DataContext"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function Upload() {
  const [csvData, setCsvData] = useState("")
  const [fileName, setFileName] = useState("")
  const [localProcessedData, setLocalProcessedData] = useState<any[]>([])
  const [isProcessed, setIsProcessed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { setStockData, setIsDataLoaded, stockData } = useData()

  const sampleData = [
    { date: "2024-01-01", price: 150.25, volume: 1000000 },
    { date: "2024-01-02", price: 152.30, volume: 1100000 },
    { date: "2024-01-03", price: 148.90, volume: 950000 },
    { date: "2024-01-04", price: 155.75, volume: 1250000 },
    { date: "2024-01-05", price: 157.20, volume: 1150000 },
  ]

  const displayData = localProcessedData.length > 0 ? localProcessedData : (stockData.length > 0 ? stockData : sampleData)
  
  const chartData = displayData.map((item, index) => ({
    name: `Day ${index + 1}`,
    value: item.price
  }))

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setIsProcessed(false)
      // In real implementation, would parse CSV here
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setCsvData(text)
      }
      reader.readAsText(file)
    }
  }

  const parseCSVData = (data: string) => {
    const lines = data.trim().split('\n')
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    // Fix column mapping according to user's rules:
    // 1. "Day" column contains dates → rename to "Date"
    // 2. "Date" column contains stock prices → move to "Price" 
    // 3. "Price" column contains volume values → move to "Volume"
    // 4. "Volume" column contains row counters → drop it
    
    const dayIndex = headers.indexOf('day')        // Contains actual dates
    const dateIndex = headers.indexOf('date')      // Contains actual prices
    const priceIndex = headers.indexOf('price')    // Contains actual volume
    // Drop volume column (contains row counters)
    
    // Check if we have the required columns (day, date, price)
    if (dayIndex === -1 || dateIndex === -1 || priceIndex === -1) {
      // Fallback to standard mapping if corrected columns not found
      const standardDateIndex = headers.indexOf('date')
      const standardPriceIndex = headers.indexOf('price') 
      const standardVolumeIndex = headers.indexOf('volume')
      
      if (standardDateIndex !== -1 && standardPriceIndex !== -1 && standardVolumeIndex !== -1) {
        return lines.slice(1).map(line => {
          const values = line.split(',')
          return {
            date: values[standardDateIndex]?.trim(),
            price: parseFloat(values[standardPriceIndex]?.trim()),
            volume: parseInt(values[standardVolumeIndex]?.trim())
          }
        }).filter(item => item.date && !isNaN(item.price) && !isNaN(item.volume))
      }
      return []
    }
    
    return lines.slice(1).map(line => {
      const values = line.split(',')
      const dateValue = values[dayIndex]?.trim()    // Actual date from "Day" column
      const priceValue = values[dateIndex]?.trim()  // Actual price from "Date" column  
      const volumeValue = values[priceIndex]?.trim() // Actual volume from "Price" column
      
      // Format the data properly
      const formattedDate = dateValue // Keep as is if already in YYYY-MM-DD format
      const formattedPrice = parseFloat(priceValue)
      const formattedVolume = parseInt(volumeValue)
      
      return {
        date: formattedDate,
        price: parseFloat(formattedPrice.toFixed(2)), // 2 decimal places
        volume: formattedVolume // Integer
      }
    }).filter(item => item.date && !isNaN(item.price) && !isNaN(item.volume))
  }

  const saveToDatabase = async (data: any[], source: 'upload' | 'manual') => {
    setIsSaving(true)
    try {
      // Prepare data for insertion
      const stockRecords = data.map(item => ({
        symbol: 'DEMO', // Default symbol for demo data
        date: item.date,
        price: item.price,
        volume: item.volume,
        source: source
      }))

      const { error } = await (supabase as any)
        .from('stock_data')
        .upsert(stockRecords, { onConflict: 'symbol,date' })

      if (error) throw error

      toast({
        title: "Data saved!",
        description: `${data.length} rows saved to database successfully.`
      })
    } catch (error) {
      console.error('Error saving to database:', error)
      toast({
        title: "Save failed",
        description: "Could not save data to database. Data is still available in this session.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleProcessData = async () => {
    if (csvData.trim()) {
      const parsed = parseCSVData(csvData)
      if (parsed.length > 0) {
        setLocalProcessedData(parsed)
        setStockData(parsed)
        setIsDataLoaded(true)
        setIsProcessed(true)
        
        // Save to database
        await saveToDatabase(parsed, fileName ? 'upload' : 'manual')
        
        toast({
          title: "Data processed successfully!",
          description: `${parsed.length} rows of stock data are now available for analysis.`
        })
      } else {
        toast({
          title: "Error processing data",
          description: "Please ensure your CSV has the correct format: Date, Price, Volume",
          variant: "destructive"
        })
      }
    } else {
      // Use sample data if no input
      setLocalProcessedData(sampleData)
      setStockData(sampleData)
      setIsDataLoaded(true)
      setIsProcessed(true)
      toast({
        title: "Using sample data",
        description: "Sample stock data loaded for demonstration."
      })
    }
  }

  // Load existing data from database on mount
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('stock_data')
          .select('date, price, volume')
          .order('date', { ascending: true })
          .limit(100)

        if (error) throw error

        if (data && data.length > 0) {
          const formattedData = data.map((item: any) => ({
            date: item.date,
            price: parseFloat(item.price as any),
            volume: item.volume
          }))
          setStockData(formattedData)
          setIsDataLoaded(true)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadExistingData()
  }, [setStockData, setIsDataLoaded])

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
          Upload stock data to save it to the database for persistent storage and analysis across all algorithm pages.
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
              <Button 
                className="w-full max-w-sm" 
                onClick={handleProcessData}
                disabled={(!fileName && !csvData.trim()) || isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : isProcessed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Data Processed & Saved
                  </>
                ) : (
                  "Process & Save Data"
                )}
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
              <Button 
                onClick={handleProcessData}
                disabled={!csvData.trim() || isSaving}
              >
                {isSaving ? (
                  "Saving..."
                ) : isProcessed ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Data Processed & Saved
                  </>
                ) : (
                  "Process & Save Data"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartArea 
          title={isProcessed ? "Processed Stock Data" : "Sample Stock Data"}
          description={isProcessed ? "Your uploaded stock prices" : "Preview of sample stock prices"}
          data={chartData}
        />
        
        <DataTable
          title="Data Summary"
          description={isProcessed ? `${displayData.length} rows of processed data` : "Sample data preview"}
          headers={["Date", "Price (₹)", "Volume"]}
          data={displayData.slice(0, 10)}
        />
      </div>
    </div>
  )
}