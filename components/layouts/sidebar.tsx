"use client"

import React, { useState } from 'react'
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Bot,
  FileText,
  Users,
  TrendingUp,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Megaphone,
  BarChart3,
  Wrench,
  Shield,
  HelpCircle,
  Zap,
  Bell
} from "lucide-react"

interface SidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
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

export function Sidebar({ collapsed = false, onCollapsedChange, className }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['Agents']))

  const toggleExpanded = (title: string) => {
    if (collapsed) return

    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const isExpanded = expandedItems.has(item.title)
    const hasChildren = item.children && item.children.length > 0
    const IconComponent = item.icon

    const navItemContent = (
      <Button
        variant={item.active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 font-normal",
          level > 0 && "ml-6 h-8",
          collapsed && level === 0 && "justify-center px-2"
        )}
        onClick={() => hasChildren ? toggleExpanded(item.title) : undefined}
      >
        <IconComponent className={cn("h-4 w-4", collapsed && "h-5 w-5")} />
        {!collapsed && (
          <>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto h-5 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    )

    if (collapsed && level === 0) {
      return (
        <TooltipProvider key={item.title}>
          <Tooltip>
            <TooltipTrigger asChild>
              {navItemContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.title}
              {item.badge && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <div key={item.title}>
        {navItemContent}
        {hasChildren && isExpanded && !collapsed && (
          <div className="space-y-1 mt-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">FinAdvise</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary mx-auto">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navigationItems.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="border-t p-3">
        <div className="space-y-1">
          {bottomNavItems.map(item => renderNavItem(item))}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapsedChange?.(!collapsed)}
          className={cn(
            "w-full",
            collapsed ? "justify-center px-2" : "justify-start"
          )}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 mr-2" />
              Collapse
            </>
          )}
        </Button>
      </div>

      {/* System Status Indicator */}
      <div className={cn(
        "border-t p-3",
        collapsed && "flex justify-center"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "flex-col"
        )}>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {!collapsed && (
            <span className="text-xs text-muted-foreground">System Online</span>
          )}
        </div>
      </div>
    </div>
  )
}