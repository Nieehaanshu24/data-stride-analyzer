import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Index from "./pages/Index";
import StockSpan from "./pages/StockSpan";
import RangeQueries from "./pages/RangeQueries";
import SlidingWindow from "./pages/SlidingWindow";
import NotFound from "./pages/NotFound";
import { DataProvider } from "./contexts/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/stock-span" element={<StockSpan />} />
              <Route path="/range-queries" element={<RangeQueries />} />
              <Route path="/sliding-window" element={<SlidingWindow />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
