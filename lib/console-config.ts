/**
 * Development Console Configuration
 * 
 * This file provides utilities for managing console output during development.
 * It helps distinguish between application errors and external noise from browser extensions.
 */

export const ConsoleConfig = {
  // Enable/disable error suppression
  suppressExternalErrors: process.env.NODE_ENV === 'development',
  
  // Patterns to suppress (browser extension errors)
  suppressedPatterns: [
    'runtime.lastError',
    'message port closed',
    'forward-logs-shared',
    'paywall-configuration-manager',
    'AuthContext',
    'Unchecked runtime.lastError',
    'chrome-extension://',
    'net::ERR_FILE_NOT_FOUND',
    'completion_list.html',
    'utils.js',
    'heuristicsRedefinitions.js',
    'extensionState.js',
    'URL changed, fetching new Sublime highlights',
    'Unlisted TLDs in URLs are not supported'
  ],
  
  // Development-only console enhancements
  enableDevLogging: process.env.NODE_ENV === 'development',
  
  // Log levels
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error'
}

/**
 * Enhanced console logging for development
 */
export const devConsole = {
  log: (...args: any[]) => {
    if (ConsoleConfig.enableDevLogging) {
      console.log('[DEV]', ...args)
    }
  },
  
  warn: (...args: any[]) => {
    if (ConsoleConfig.enableDevLogging) {
      console.warn('[DEV]', ...args)
    }
  },
  
  error: (...args: any[]) => {
    console.error('[DEV]', ...args)
  },
  
  info: (...args: any[]) => {
    if (ConsoleConfig.enableDevLogging) {
      console.info('[DEV]', ...args)
    }
  }
}

/**
 * Check if an error should be suppressed
 */
export function shouldSuppressError(message: string): boolean {
  if (!ConsoleConfig.suppressExternalErrors) return false
  
  return ConsoleConfig.suppressedPatterns.some(pattern => 
    message.includes(pattern)
  )
}
