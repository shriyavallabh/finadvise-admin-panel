"use client"

import React from 'react'
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Bot,
  FileText,
  Users,
  TrendingUp,
  Settings,
  Megaphone,
  BarChart3,
  Wrench,
  Shield,
  HelpCircle,
  Zap,
  Bell,
  X
} from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  active?: boolean
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Bot,
    badge: "4",
    children: [
      { title: "Overview", href: "/agents", icon: LayoutDashboard },
      { title: "Management", href: "/agents/manage", icon: Settings },
      { title: "Logs", href: "/agents/logs", icon: FileText },
      { title: "Performance", href: "/agents/performance", icon: TrendingUp }
    ]
  },
  {
    title: "Content",
    href: "/content",
    icon: FileText,
    children: [
      { title: "Templates", href: "/content/templates", icon: FileText },
      { title: "Studio", href: "/content/studio", icon: Wrench },
      { title: "Approval Queue", href: "/content/approvals", icon: Shield },
      { title: "Media Library", href: "/content/media", icon: FileText }
    ]
  },
  {
    title: "Advisors",
    href: "/advisors",
    icon: Users,
    badge: "234",
    children: [
      { title: "Directory", href: "/advisors", icon: Users },
      { title: "Segments", href: "/advisors/segments", icon: TrendingUp },
      { title: "Performance", href: "/advisors/performance", icon: BarChart3 },
      { title: "Communications", href: "/advisors/communications", icon: Megaphone }
    ]
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    badge: "12",
    children: [
      { title: "Active", href: "/campaigns/active", icon: Zap },
      { title: "Builder", href: "/campaigns/builder", icon: Wrench },
      { title: "Scheduled", href: "/campaigns/scheduled", icon: LayoutDashboard },
      { title: "History", href: "/campaigns/history", icon: FileText }
    ]
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    children: [
      { title: "Overview", href: "/analytics", icon: LayoutDashboard },
      { title: "Agents", href: "/analytics/agents", icon: Bot },
      { title: "Content", href: "/analytics/content", icon: FileText },
      { title: "Custom Reports", href: "/analytics/reports", icon: BarChart3 }
    ]
  },
  {
    title: "System",
    href: "/system",
    icon: Settings,
    children: [
      { title: "Configuration", href: "/system/config", icon: Settings },
      { title: "Integrations", href: "/system/integrations", icon: Zap },
      { title: "Security", href: "/system/security", icon: Shield },
      { title: "Logs", href: "/system/logs", icon: FileText }
    ]
  }
]

const bottomNavItems: NavItem[] = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "3"
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
]

export function MobileNav({ isOpen, onOpenChange, className }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const handleNavItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.title)
    } else {
      // Navigate to the page and close the mobile nav
      console.log(`Navigate to ${item.href}`)
      onOpenChange(false)
    }
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.title)
    const hasChildren = item.children && item.children.length > 0
    const IconComponent = item.icon

    return (
      <div key={item.title}>
        <Button
          variant={item.active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 font-normal h-10",
            level > 0 && "ml-6 h-9 text-sm"
          )}
          onClick={() => handleNavItemClick(item)}
        >
          <IconComponent className="h-4 w-4" />
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 text-xs">
              {item.badge}
            </Badge>
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div className="space-y-1 mt-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <SheetTitle className="text-sm font-semibold">FinAdvise</SheetTitle>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-2">
              {navigationItems.map(item => renderNavItem(item))}
            </div>
          </ScrollArea>

          {/* Bottom Navigation */}
          <div className="border-t p-4">
            <div className="space-y-2">
              {bottomNavItems.map(item => renderNavItem(item))}
            </div>
          </div>

          {/* System Status */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 border border-green-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-700 font-medium">System Online</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}