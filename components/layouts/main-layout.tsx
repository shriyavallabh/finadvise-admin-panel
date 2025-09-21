"use client"

import React, { useState } from 'react'
import { cn } from "@/components/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { MobileNav } from "@/components/layouts/mobile-nav"

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav
          isOpen={isMobileSidebarOpen}
          onOpenChange={setIsMobileSidebarOpen}
        />
      </div>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <Header
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMobileSidebarToggle={() => setIsMobileSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}