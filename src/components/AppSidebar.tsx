import { BarChart3, Upload, TrendingUp, AreaChart, Activity } from "lucide-react"
import { NavLink } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { title: "Upload Data", url: "/", icon: Upload },
  { title: "Stock Span", url: "/stock-span", icon: TrendingUp },
  { title: "Range Queries", url: "/range-queries", icon: AreaChart },
  { title: "Sliding Window", url: "/sliding-window", icon: Activity },
]

export function AppSidebar() {
  const { open } = useSidebar()

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            {open && (
              <div>
                <h1 className="text-lg font-semibold">Stock Analyzer</h1>
                <p className="text-xs text-muted-foreground">Dynamic Analysis Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Analysis Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
                          : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}