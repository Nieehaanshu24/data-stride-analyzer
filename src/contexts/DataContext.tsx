import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface StockData {
  date: string
  price: number
  volume: number
}

interface DataContextType {
  stockData: StockData[]
  setStockData: (data: StockData[]) => void
  isDataLoaded: boolean
  setIsDataLoaded: (loaded: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  return (
    <DataContext.Provider value={{
      stockData,
      setStockData,
      isDataLoaded,
      setIsDataLoaded
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}