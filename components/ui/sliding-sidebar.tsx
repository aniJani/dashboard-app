"use client"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SlidingSidebarProps {
  children: React.ReactNode
  className?: string
}

export function SlidingSidebar({ children, className }: SlidingSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Backdrop for mobile only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Two versions of the sidebar: one for mobile (animated) and one for desktop (fixed) */}
      <div className="hidden lg:block w-80 min-h-screen border-r border-accent/20">
        <div className="h-full overflow-y-auto p-4">
          {children}
        </div>
      </div>

      {/* Mobile sliding version */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 20 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-80 bg-background border-r border-accent/20",
          "lg:hidden", // Hide on large screens
          className
        )}
      >
        <div className="h-full overflow-y-auto p-4 pt-16">
          {children}
        </div>
      </motion.div>
    </>
  )
} 