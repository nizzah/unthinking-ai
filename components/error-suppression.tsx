"use client"

import { useEffect } from "react"
import { shouldSuppressError, devConsole } from "@/lib/console-config"

/**
 * ErrorSuppression component handles browser extension errors and other external noise
 * that can clutter the console during development.
 */
export function ErrorSuppression() {
  useEffect(() => {
    // Store original console methods
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log

    // Suppress specific external errors
    const suppressExternalErrors = (args: any[]) => {
      const message = args.join(' ')
      
      if (shouldSuppressError(message)) {
        devConsole.log('Suppressed external error:', message)
        return true
      }
      
      return false
    }

    // Override console.error to filter external errors
    console.error = (...args: any[]) => {
      if (!suppressExternalErrors(args)) {
        originalError.apply(console, args)
      }
    }

    // Override console.warn to filter external warnings
    console.warn = (...args: any[]) => {
      if (!suppressExternalErrors(args)) {
        originalWarn.apply(console, args)
      }
    }

    // Override console.log to filter external logs
    console.log = (...args: any[]) => {
      if (!suppressExternalErrors(args)) {
        originalLog.apply(console, args)
      }
    }

    // Handle unhandled promise rejections from extensions
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString() || ''
      
      if (shouldSuppressError(reason)) {
        devConsole.log('Suppressed unhandled rejection:', reason)
        event.preventDefault()
        return false
      }
    }

    // Handle global errors from extensions
    const handleGlobalError = (event: ErrorEvent) => {
      const message = event.message || ''
      
      if (shouldSuppressError(message)) {
        devConsole.log('Suppressed global error:', message)
        event.preventDefault()
        return false
      }
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleGlobalError)
    
    // Also intercept at document level for more comprehensive coverage
    document.addEventListener('error', handleGlobalError)
    
    // Intercept console methods more aggressively
    const originalConsoleMethods = {
      error: console.error,
      warn: console.warn,
      log: console.log,
      info: console.info,
      debug: console.debug
    }
    
    // Override all console methods
    Object.keys(originalConsoleMethods).forEach(method => {
      const original = originalConsoleMethods[method as keyof typeof originalConsoleMethods]
      console[method as keyof Console] = (...args: any[]) => {
        if (!suppressExternalErrors(args)) {
          original.apply(console, args)
        }
      }
    })

    // Cleanup function
    return () => {
      // Restore original console methods
      Object.keys(originalConsoleMethods).forEach(method => {
        const original = originalConsoleMethods[method as keyof typeof originalConsoleMethods]
        console[method as keyof Console] = original
      })
      
      // Remove event listeners
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleGlobalError)
      document.removeEventListener('error', handleGlobalError)
    }
  }, [])

  // This component doesn't render anything
  return null
}
